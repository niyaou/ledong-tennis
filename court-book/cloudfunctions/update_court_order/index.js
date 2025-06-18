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
  const results = []

  // 批量获取所有booked_by的手机号，用于检查管理员权限
  const phoneNumbers = [...new Set(dataList.map(item => item.booked_by))]
  const managerCheck = await db.collection('manager')
    .where({
      phoneNumber: _.in(phoneNumbers)
    })
    .get()
  
  // 创建管理员手机号集合，用于快速查找（O(1)时间复杂度）
  const managerPhones = new Set(managerCheck.data.map(m => m.phoneNumber))

  // 批量获取所有court_ids，检查订单是否已存在
  const courtIds = dataList.map(item => item.court_id)
  const existRes = await db.collection('court_order_collection')
    .where({
      court_id: _.in(courtIds)
    })
    .get()

  // 创建现有订单的Map，用于快速查找（O(1)时间复杂度）
  const existingOrders = new Map(
    existRes.data.map(order => [order.court_id, order])
  )

  // 准备批量操作
  const addOperations = [] // 需要新增的订单
  const updateOperations = [] // 需要更新的订单

  // 第一阶段：准备所有操作
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
        // 订单已存在，准备更新操作
        const oldVersion = existingOrder.version || 1
        updateOperations.push({
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
            version: oldVersion + 1, // 版本号+1，用于并发控制
            updated_at: now,
          },
          version: oldVersion // 保存当前版本号，用于更新时的条件判断
        })
      } else {
        // 订单不存在，准备插入操作
        addOperations.push({
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
            version: 1, // 新订单版本号从1开始
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

  // 第二阶段：执行更新操作
  // 注意：更新操作需要单独执行，因为每个更新都需要检查版本号
  for (const op of updateOperations) {
    try {
      const updateRes = await db.collection('court_order_collection')
        .where({
          court_id: op.court_id,
          version: op.version // 使用版本号作为条件，确保并发安全
        })
        .update({
          data: op.data
        })

      results.push({
        court_id: op.court_id,
        success: updateRes.stats.updated > 0,
        type: 'update',
        updated: updateRes.stats.updated,
        error: updateRes.stats.updated === 0 ? '并发冲突，订单已被修改或抢订' : undefined
      })
    } catch (e) {
      results.push({
        court_id: op.court_id,
        success: false,
        error: e.message,
      })
    }
  }

  // 第三阶段：执行插入操作
  // 注意：在插入之前，需要再次检查订单是否已存在，防止并发问题
  if (addOperations.length > 0) {
    // 再次检查所有要插入的订单是否已存在
    const finalCheck = await db.collection('court_order_collection')
      .where({
        court_id: _.in(addOperations.map(op => op.court_id))
      })
      .get()

    const existingIds = new Set(finalCheck.data.map(order => order.court_id))
    
    // 过滤掉已经存在的订单
    const validAddOperations = addOperations.filter(op => !existingIds.has(op.court_id))

    if (validAddOperations.length > 0) {
      try {
        // 批量插入有效的订单
        const addRes = await db.collection('court_order_collection').add({
          data: validAddOperations.map(op => op.data)
        })
        
        // 记录成功的插入操作
        validAddOperations.forEach((op, index) => {
          results.push({
            court_id: op.court_id,
            success: true,
            type: 'add',
            id: addRes._id
          })
        })

        // 记录被过滤掉的订单（因为并发冲突）
        addOperations
          .filter(op => existingIds.has(op.court_id))
          .forEach(op => {
            results.push({
              court_id: op.court_id,
              success: false,
              error: '并发冲突，订单已被其他用户创建'
            })
          })
      } catch (e) {
        validAddOperations.forEach(op => {
          results.push({
            court_id: op.court_id,
            success: false,
            error: e.message,
          })
        })
      }
    }
  }

  return { results }
}