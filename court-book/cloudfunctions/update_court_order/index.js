// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const _ = db.command

  // 支持批量：event.data 为数组，单个为对象
  const dataList = Array.isArray(event.data) ? event.data : [event]
  const now = new Date()
  const results = []

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
      // 查询是否已存在
      const existRes = await db.collection('court_order_collection').where({ court_id }).get()
      if (existRes.data && existRes.data.length > 0) {
        // 已存在，更新
        const updateRes = await db.collection('court_order_collection').where({ court_id }).update({
          data: {
            campus,
            courtNumber,
            date,
            start_time,
            end_time,
            status,
            price,
            booked_by,
            is_verified,
            updated_at: now,
          }
        })
        results.push({
          court_id,
          success: true,
          type: 'update',
          updated: updateRes.stats.updated,
        })
      } else {
        // 不存在，插入
        const addRes = await db.collection('court_order_collection').add({
          data: {
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
            created_at: now,
            updated_at: now,
          }
        })
        results.push({
          court_id,
          success: true,
          type: 'add',
          id: addRes._id,
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
  return { results }
}