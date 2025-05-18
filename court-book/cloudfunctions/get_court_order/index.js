// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

function generateTimeSlots(start, end, interval) {
  // start, end: 'HH:mm' 字符串
  // interval: 分钟数
  const slots = []
  let [sh, sm] = start.split(':').map(Number)
  let [eh, em] = end.split(':').map(Number)
  let startMinutes = sh * 60 + sm
  let endMinutes = eh * 60 + em

  for (let t = startMinutes; t < endMinutes; t += interval) {
    let h1 = Math.floor(t / 60)
    let m1 = t % 60
    let h2 = Math.floor((t + interval) / 60)
    let m2 = (t + interval) % 60
    slots.push({
      start: `${h1.toString().padStart(2, '0')}:${m1.toString().padStart(2, '0')}`,
      end: `${h2.toString().padStart(2, '0')}:${m2.toString().padStart(2, '0')}`
    })
  }
  return slots
}

function getPrice(court, slot) {
  return 60;
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  const { date, campus, courtNumber } = event

  // 1. 查询场地列表
  const courtList = await db.collection('court').where({ campus }).get()

  // 2. 生成时间段
  const timeSlots = generateTimeSlots('06:00', '24:00', 30) // 30分钟一段

  // 3. 查询预订状态
  const orderRes = await db.collection('court_order_collection').where({
    date,
    campus,
    courtNumber // 可选，或遍历所有场地
  }).get()
  const orderList = orderRes.data

  // 3.1 过滤并删除过期的锁定订单
  const now = new Date()
  const expiredLockedOrders = orderList.filter(order => {
    if (order.status === 'locked') {
      const orderTime = new Date(order.updated_at)
      const diffMinutes = (now - orderTime) / (1000 * 60)
      return diffMinutes > 10
    }
    return false
  })

  // 删除过期的锁定订单
  if (expiredLockedOrders.length > 0) {
    const expiredOrderIds = expiredLockedOrders.map(order => order._id)
    await db.collection('court_order_collection').where({
      _id: db.command.in(expiredOrderIds)
    }).remove()
    
    // 从orderList中移除已删除的订单
    const expiredOrderIdSet = new Set(expiredOrderIds)
    const filteredOrderList = orderList.filter(order => !expiredOrderIdSet.has(order._id))
    orderList.length = 0
    orderList.push(...filteredOrderList)
  }

  // 4. 补全空闲状态
  const result = []
  for (let court of courtList.data) {
    for (let slot of timeSlots) {
      const order = orderList.find(o => o.courtNumber === court.courtNumber && o.start_time === slot.start && o.end_time === slot.end)
      if (order) {
        result.push(order)
      } else {
        result.push({
          courtNumber: court.courtNumber,
          campus: court.campus,
          date,
          start_time: slot.start,
          end_time: slot.end,
          status: 'free',
          price: getPrice(court, slot), // 可查配置
        })
      }
    }
  }

  // 5. 返回
  return { success: true, data: result }
}