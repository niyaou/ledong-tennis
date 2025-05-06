// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const { campus } = event

  try {
    // 查询 court 表中指定校区的所有场地
    const res = await db.collection('court').where({ campus }).get()
    return {
      success: true,
      data: res.data
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}