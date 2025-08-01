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

  // 检查是否是管理员
  const managerCheck = await db.collection('manager').where({
    phoneNumber: phoneNumber
  }).get()

  const isManager = managerCheck.data && managerCheck.data.length > 0

  if (isManager) {
    // 如果是管理员，查询7天内的数据
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    query._ = db.command.or([
      {
        status: 'PAIDED',
        createTime: db.command.gte(sevenDaysAgo)
      },
      {
        status: 'PENDING',
        createTime: db.command.gte(sevenDaysAgo)
      }
    ])
  } else {
    // 如果不是管理员，使用原有的查询逻辑
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
    query._ = db.command.or([
      {
        status: 'PAIDED'
      },
      {
        status: 'PENDING',
        createTime: db.command.gte(tenMinutesAgo)
      }
    ])
  }

  // 计算分页参数
  const skip = (pageNum - 1) * pageSize

  // 查询 pay_order 集合
  const result = await db.collection('pay_order')
    .where(query)
    .orderBy('createTime', 'desc')
    .skip(skip)
    .limit(pageSize)
    .get()

  // 如果是管理员，在应用层过滤数据
  if (isManager) {
    const now = new Date()
    const filteredData = result.data.filter(order => {
      if (!order.court_ids || order.court_ids.length === 0) {
        return false
      }

      // 遍历 court_ids 数组，找到最早的时间
      let earliestTime = null
      
      for (const courtId of order.court_ids) {
        // 解析场地ID中的日期和时间
        const parts = courtId.split('_')
        if (parts.length >= 3) {
          const date = parts[1] // 例如 "20250803"
          const time = parts[2] // 例如 "20:00"
          
          const year = parseInt(date.substring(0, 4))
          const month = parseInt(date.substring(4, 6)) - 1 // 月份从0开始
          const day = parseInt(date.substring(6, 8))
          const [hour, minute] = time.split(':').map(Number)
          
          // 创建预订时间对象
          const bookingTime = new Date(year, month, day, hour, minute)
          
          // 找到最早的时间
          if (!earliestTime || bookingTime < earliestTime) {
            earliestTime = bookingTime
          }
        }
      }
      
      // 如果最早的时间晚于当前时间，则显示该订单
      return earliestTime && earliestTime > now
    })

    return {
      data: filteredData
    }
  }

  return {
    data: result.data
  }
}