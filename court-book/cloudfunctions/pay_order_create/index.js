// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 生成32位订单号
function generateOrderNo(params) {
  const { phoneNumber, openid, total_fee, campus, courtNumber, date, timeSeries } = params;
  // 组合参数并添加时间戳
  const baseStr = `${phoneNumber}${openid}${total_fee}${campus}${courtNumber}${date}${timeSeries}${Date.now()}`;
  // 使用crypto模块生成hash
  const crypto = require('crypto');
  const hash = crypto.createHash('md5').update(baseStr).digest('hex');
  // 取前32位
  return hash.substring(0, 32);
}

// 云函数入口函数
exports.main = async (event, ) => {
  const { phoneNumber,  total_fee,  openid,  court_ids  ,nonceStr } = event
  const outTradeNo = generateOrderNo(event)

  const res = await cloud.cloudPay.unifiedOrder({
    outTradeNo,
    body: `订场-在线支付`,
    totalFee: total_fee*100,
    subMchId :"1716570749",
    nonceStr,
    openid,
    spbillCreateIp: '127.0.0.1',
    envId:"cloud1-6gebob4m4ba8f3de",
    tradeType: "JSAPI",
    functionName: "order_create_callback", // 支付结果通知回调云函数名,
  })

  // 创建订单记录
  const db = cloud.database()
  await db.collection('pay_order').add({
    data: {
      phoneNumber,
      total_fee,
      court_ids,
      outTradeNo,
      payment_parmas:res.payment,
      createTime: db.serverDate(),
      status: 'PENDING' // 初始状态为待支付
    }
  })
  
  return res
}