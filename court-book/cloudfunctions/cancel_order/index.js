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

  return {
    _id,
    court_ids,
    status: 'CANCEL'
  }
}