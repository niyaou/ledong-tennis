// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  const { phoneNumber, pageNum = 1, pageSize = 10 } = event

  // 构建查询条件
  const query = {}
  if (phoneNumber) {
    query.phoneNumber = phoneNumber
  }

  // 计算10分钟前的时间戳
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)

  // 添加状态筛选条件
  query._ = db.command.or([
    {
      status: 'PAIDED'
    },
    {
      status: 'PENDING',
      createTime: db.command.gte(tenMinutesAgo)
    }
  ])

  // 计算分页参数
  const skip = (pageNum - 1) * pageSize

  // 查询 pay_order 集合
  const result = await db.collection('pay_order')
    .where(query)
    .orderBy('createTime', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()

  return {
    data: result.data
  }
}