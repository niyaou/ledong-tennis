// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, ) => {
  const { order } = event
  const { _id, court_ids } = order

  const db = cloud.database()
  
  // 查询订单
  const orderResult = await db.collection('pay_order').doc(_id).get()
  
  // 检查订单是否存在
  if (!orderResult.data) {
    return {
    
      message: '订单不存在'
    }
  }

  const phoneNumber = orderResult.data.phoneNumber
  
  // 检查是否是管理员
  const managerCheck = await db.collection('manager').where({
    phoneNumber: phoneNumber
  }).get()

  const isManager = managerCheck.data && managerCheck.data.length > 0

  if (isManager) {
    // 如果是管理员，直接删除court_order_collection中的记录
    for (const court_id of court_ids) {
      await db.collection('court_order_collection')
        .where({
          court_id: court_id
        })
        .remove()
    }
    
    // 更新订单状态为CANCEL
    await db.collection('pay_order').doc(_id).update({
      data: {
        status: 'CANCEL'
      }
    })
  } else {
    // 如果不是管理员，使用原有逻辑
    // 如果订单状态是PENDING，则更新为CANCEL
    if (orderResult.data.status === 'PENDING') {
      await db.collection('pay_order').doc(_id).update({
        data: {
          status: 'CANCEL'
        }
      })

      // 删除court_order_collection中匹配的记录
      for (const court_id of court_ids) {
        await db.collection('court_order_collection')
          .where({
            court_id: court_id,
            status: 'locked'
          })
          .remove()
      }
    }
  }

  return {
    _id,
    court_ids,
    status: 'CANCEL'
  }
}