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
  // const court_price_mapping={
  //   "1号风雨棚":90,
  //   "2号室外":60,
  //   "3号室外":60,
  //   "4号风雨棚":90,
  //   "5号风雨棚":90,
  //   "6号风雨棚":90,
  //   "7号室外":60,
  //   "8号室外":60,
  //   "9号室外":60,
  //   "10号室外":60,
  //   "11号红土风雨棚":100,
   
  // }
  const court_price_mapping={
    "1号风雨棚":0.09,
    "2号室外":0.06,
    "3号室外":0.06,
    "4号风雨棚":0.09,
    "5号风雨棚":0.09,
    "6号风雨棚":0.09,
    "7号室外":0.06,
    "8号室外":0.06,
    "9号室外":0.06,
    "10号室外":0.06,
    "11号红土风雨棚":0.1,
   
  }
  const basePrice = court_price_mapping[court];
  const [hour] = slot.start.split(':').map(Number);
  return hour >= 19 ? basePrice + 10 : basePrice;
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  const { date, campus, courtNumber } = event

  // 1. 查询场地列表
  const courtList = await db.collection('court').where({ campus }).get()
  console.log('场地列表:', courtList.data)

  // 2. 生成时间段
  const timeSlots = generateTimeSlots('07:00', '24:00', 30) // 30分钟一段
  // console.log('生成的时间段:', timeSlots)

  // 3. 查询预订状态
  const MAX_LIMIT = 100
  const countResult = await db.collection('court_order_collection').where({
    date,
    campus,
    courtNumber // 可选，或遍历所有场地
  }).count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('court_order_collection').where({
      date,
      campus,
      courtNumber
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  const orderRes = await Promise.all(tasks)
  const orderList = orderRes.reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data)
    }
  }, { data: [] }).data
  console.log('查询到的订单列表数量:', orderList.length)
  console.log('查询到的订单列表数据大小:', JSON.stringify(orderList).length, 'bytes')

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
  console.log('过期的锁定订单数量:', expiredLockedOrders.length)

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
    console.log('删除过期订单后的订单列表数量:', orderList.length)
  }

  // 4. 补全空闲状态
  const result = []
  // 优化：只处理指定的场地
  const targetCourts = courtNumber ? 
    courtList.data.filter(court => court.courtNumber === courtNumber) : 
    courtList.data

  for (let court of targetCourts) {
    console.log('处理场地:', court.courtNumber)
    for (let slot of timeSlots) {
      const order = orderList.find(o => o.courtNumber === court.courtNumber && o.start_time === slot.start && o.end_time === slot.end)
      if (order) {
        // 移除 _at 字段和其他不必要的字段
        const { created_at, updated_at, _id, ...orderWithoutAt } = order
        result.push(orderWithoutAt)
      } else {
        result.push({
          courtNumber: court.courtNumber,
          campus: court.campus,
          date,
          start_time: slot.start,
          end_time: slot.end,
          status: 'free',
          price: getPrice(court.courtNumber, slot),
        })
      }
    }
  }

  // 5. 返回
  console.log('最终返回结果数量:', result.length)
  console.log('最终返回数据大小:', JSON.stringify(result).length, 'bytes')
  
  // 检查返回数据大小是否超过限制
  const responseSize = JSON.stringify({ success: true, data: result }).length
  if (responseSize > 900 * 1024) { // 900KB 作为安全阈值
    console.error('返回数据过大:', responseSize, 'bytes')
    return {
      success: false,
      error: '数据量过大，请缩小查询范围'
    }
  }

  return { success: true, data: result }
}