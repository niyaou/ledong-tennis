// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

/**
 * 更新或创建球场订单
 * 主要功能：
 * 1. 支持批量处理多个订单
 * 2. 检查预订者是否为管理员
 * 3. 处理订单的创建和更新
 * 4. 使用版本号控制并发
 * 5. 防止管理员之间的场地冲突
 * 6. 实现事务性操作，确保数据一致性
 * 
 * @param {Object} event - 事件对象
 * @param {Object|Array} event.data - 单个订单对象或订单数组
 * @returns {Object} 处理结果
 */
exports.main = async (event, ) => {
  const db = cloud.database()
  const _ = db.command

  // 支持批量：event.data 为数组，单个为对象
  const dataList = Array.isArray(event.data) ? event.data : [event]
  const now = new Date()

  try {
    // 第一阶段：预检查所有操作
    const preCheckResult = await preCheckOperations(dataList, db, _)
    
    if (!preCheckResult.success) {
      return {
        success: false,
        error: '预检查失败',
        results: preCheckResult.results
      }
    }

    // 第二阶段：执行事务性操作
    const transactionResult = await executeTransaction(
      preCheckResult.operations,
      db,
      _
    )

    return {
      success: true,
      results: transactionResult.results
    }

  } catch (error) {
    console.error('事务执行失败:', error)
    return {
      success: false,
      error: error.message,
      results: []
    }
  }
}

/**
 * 预检查所有操作
 * @param {Array} dataList - 数据列表
 * @param {Object} db - 数据库对象
 * @param {Object} _ - 数据库命令对象
 * @returns {Object} 预检查结果
 */
async function preCheckOperations(dataList, db, _) {
  const results = []
  const operations = {
    updates: [],
    adds: []
  }
  const now = new Date()

  // 批量获取所有booked_by的手机号，用于检查管理员权限
  const phoneNumbers = [...new Set(dataList.map(item => item.booked_by))]
  const managerCheck = await db.collection('manager')
    .where({
      phoneNumber: _.in(phoneNumbers)
    })
    .get()
  
  // 创建管理员手机号集合，用于快速查找
  const managerPhones = new Set(managerCheck.data.map(m => m.phoneNumber))

  // 批量获取所有court_ids，检查订单是否已存在
  const courtIds = dataList.map(item => item.court_id)
  const existRes = await db.collection('court_order_collection')
    .where({
      court_id: _.in(courtIds)
    })
    .get()

  // 创建现有订单的Map，用于快速查找
  const existingOrders = new Map(
    existRes.data.map(order => [order.court_id, order])
  )

  // 检查每个操作
  for (const item of dataList) {
    const {
      court_id,
      campus,
      courtNumber,
      date,
      start_time,
      end_time,
      status,
      price,
      booked_by,
      is_verified,
    } = item

    try {
      // 快速检查是否是管理员，如果是管理员则状态设为booked
      const finalStatus = managerPhones.has(booked_by) ? 'booked' : status

      const existingOrder = existingOrders.get(court_id)
      if (existingOrder) {
        // 订单已存在，检查是否可以更新
        const canUpdate = checkCanUpdate(existingOrder, booked_by, managerPhones)
        
        if (!canUpdate.success) {
          results.push({
            court_id,
            success: false,
            error: canUpdate.error,
            type: 'conflict'
          })
          continue
        }

        // 订单已存在，准备更新操作
        const oldVersion = existingOrder.version || 1
        operations.updates.push({
          court_id,
          data: {
            campus,
            courtNumber,
            date,
            start_time,
            end_time,
            status: finalStatus,
            price,
            booked_by,
            is_verified,
            version: oldVersion + 1,
            updated_at: now,
          },
          version: oldVersion,
          originalOrder: existingOrder
        })
      } else {
        // 订单不存在，准备插入操作
        operations.adds.push({
          court_id,
          data: {
            court_id,
            campus,
            courtNumber,
            date,
            start_time,
            end_time,
            status: finalStatus,
            price,
            booked_by,
            is_verified,
            version: 1,
            created_at: now,
            updated_at: now,
          }
        })
      }
    } catch (e) {
      results.push({
        court_id,
        success: false,
        error: e.message,
      })
    }
  }

  // 如果有任何预检查失败，返回失败
  if (results.some(r => !r.success)) {
    return {
      success: false,
      results: results
    }
  }

  return {
    success: true,
    operations: operations
  }
}

/**
 * 执行事务性操作
 * @param {Object} operations - 操作对象
 * @param {Object} db - 数据库对象
 * @param {Object} _ - 数据库命令对象
 * @returns {Object} 执行结果
 */
async function executeTransaction(operations, db, _) {
  const results = []
  const successfulUpdates = []
  const successfulAdds = []

  try {
    // 第一步：执行所有更新操作
    for (const op of operations.updates) {
      try {
        const updateRes = await db.collection('court_order_collection')
          .where({
            court_id: op.court_id,
            version: op.version
          })
          .update({
            data: op.data
          })

        if (updateRes.stats.updated > 0) {
          successfulUpdates.push({
            ...op,
            updateResult: updateRes
          })
          results.push({
            court_id: op.court_id,
            success: true,
            type: 'update',
            updated: updateRes.stats.updated
          })
        } else {
          // 更新失败，需要回滚所有已成功的操作
          await rollbackUpdates(successfulUpdates, db)
          return {
            success: false,
            results: [{
              court_id: op.court_id,
              success: false,
              error: '并发冲突，订单已被修改或抢订',
              type: 'update'
            }]
          }
        }
      } catch (e) {
        // 更新异常，需要回滚所有已成功的操作
        await rollbackUpdates(successfulUpdates, db)
        return {
          success: false,
          results: [{
            court_id: op.court_id,
            success: false,
            error: e.message,
            type: 'update'
          }]
        }
      }
    }

    // 第二步：执行所有插入操作
    if (operations.adds.length > 0) {
      try {
        // 再次检查所有要插入的订单是否已存在
        const finalCheck = await db.collection('court_order_collection')
          .where({
            court_id: _.in(operations.adds.map(op => op.court_id))
          })
          .get()

        const existingIds = new Set(finalCheck.data.map(order => order.court_id))
        
        // 过滤掉已经存在的订单
        const validAddOperations = operations.adds.filter(op => !existingIds.has(op.court_id))

        if (validAddOperations.length > 0) {
          // 批量插入有效的订单
          const addRes = await db.collection('court_order_collection').add({
            data: validAddOperations.map(op => op.data)
          })
          
          // 记录成功的插入操作
          validAddOperations.forEach((op, index) => {
            successfulAdds.push(op)
            results.push({
              court_id: op.court_id,
              success: true,
              type: 'add',
              id: addRes._id
            })
          })

          // 记录被过滤掉的订单（因为并发冲突）
          operations.adds
            .filter(op => existingIds.has(op.court_id))
            .forEach(op => {
              results.push({
                court_id: op.court_id,
                success: false,
                error: '并发冲突，订单已被其他用户创建',
                type: 'add'
              })
            })
        }
      } catch (e) {
        // 插入异常，需要回滚所有已成功的操作
        await rollbackUpdates(successfulUpdates, db)
        await rollbackAdds(successfulAdds, db)
        return {
          success: false,
          results: [{
            court_id: 'batch',
            success: false,
            error: e.message,
            type: 'add'
          }]
        }
      }
    }

    // 第三步：检查是否有任何操作失败
    if (results.some(r => !r.success)) {
      // 如果有任何操作失败，回滚所有操作
      await rollbackUpdates(successfulUpdates, db)
      await rollbackAdds(successfulAdds, db)
      
      return {
        success: false,
        results: results.map(r => ({
          ...r,
          success: false,
          error: r.error || '部分操作失败，已回滚所有操作'
        }))
      }
    }

    return {
      success: true,
      results: results
    }

  } catch (error) {
    // 发生异常，回滚所有操作
    await rollbackUpdates(successfulUpdates, db)
    await rollbackAdds(successfulAdds, db)
    
    return {
      success: false,
      results: [{
        court_id: 'batch',
        success: false,
        error: error.message,
        type: 'transaction'
      }]
    }
  }
}

/**
 * 回滚更新操作
 * @param {Array} successfulUpdates - 成功的更新操作列表
 * @param {Object} db - 数据库对象
 */
async function rollbackUpdates(successfulUpdates, db) {
  const now = new Date()
  for (const update of successfulUpdates) {
    try {
      await db.collection('court_order_collection')
        .where({
          court_id: update.court_id
        })
        .update({
          data: {
            campus: update.originalOrder.campus,
            courtNumber: update.originalOrder.courtNumber,
            date: update.originalOrder.date,
            start_time: update.originalOrder.start_time,
            end_time: update.originalOrder.end_time,
            status: update.originalOrder.status,
            price: update.originalOrder.price,
            booked_by: update.originalOrder.booked_by,
            is_verified: update.originalOrder.is_verified,
            version: update.originalOrder.version,
            updated_at: now,
          }
        })
    } catch (e) {
      console.error('回滚更新操作失败:', e)
    }
  }
}

/**
 * 回滚插入操作
 * @param {Array} successfulAdds - 成功的插入操作列表
 * @param {Object} db - 数据库对象
 */
async function rollbackAdds(successfulAdds, db) {
  for (const add of successfulAdds) {
    try {
      await db.collection('court_order_collection')
        .where({
          court_id: add.court_id
        })
        .remove()
    } catch (e) {
      console.error('回滚插入操作失败:', e)
    }
  }
}

/**
 * 检查是否可以更新订单
 * @param {Object} existingOrder - 现有订单
 * @param {String} newBookedBy - 新的预订者
 * @param {Set} managerPhones - 管理员手机号集合
 * @returns {Object} 检查结果
 */
function checkCanUpdate(existingOrder, newBookedBy, managerPhones) {
  // 如果现有订单状态是 booked，不允许任何更新
  if (existingOrder.status === 'booked') {
    return {
      success: false,
      error: '场地已被预订，无法修改'
    }
  }

  // 如果现有订单状态是 locked
  if (existingOrder.status === 'locked') {
    // 检查是否是同一个用户
    if (existingOrder.booked_by === newBookedBy) {
      return { success: true }
    }
    
    // 检查锁定时间是否超过限制
    const now = new Date()
    const lockTime = new Date(existingOrder.updated_at)
    const diffMinutes = (now - lockTime) / (1000 * 60)
    
    // 统一锁定时间：管理员10分钟，普通用户5分钟
    const isNewUserManager = managerPhones.has(newBookedBy)
    const isExistingUserManager = managerPhones.has(existingOrder.booked_by)
    
    let lockTimeLimit = 5 // 默认5分钟
    if (isExistingUserManager) {
      lockTimeLimit = 10 // 管理员锁定10分钟
    }
    
    if (diffMinutes <= lockTimeLimit) {
      const userType = isExistingUserManager ? '管理员' : '用户'
      return {
        success: false,
        error: `场地已被其他${userType}锁定，请稍后再试`
      }
    }
    
    // 超过锁定时间，允许更新
    return { success: true }
  }

  // 其他状态（如 free）允许更新
  return { success: true }
}