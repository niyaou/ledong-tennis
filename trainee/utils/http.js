const app = getApp()
// var rootDocment = 'http://192.168.1.102:8081/';
// var rootDocment = 'https://192.168.2.106:8081/';
var rootDocment = 'http://192.168.2.106:8081/';
// var rootDocment = 'https://106.54.80.211:8081/';
// var rootDocment = 'http://10.217.6.43:8081/';
// var rootDocment = 'https://www.ledongtennis.cn:8081/';
var header = {
  'Accept': 'application/json',
  'content-type': 'application/x-www-form-urlencoded',
  'Authorization': 'Bearer '+app.globalData.jwt
}
function getReq(url, jwt,cb,toast = true) {
 if(toast){
  wx.showLoading({
    mask:true,
    title: '加载中',
  })
 }
  header.Authorization='Bearer '+jwt
  wx.request({
    url: rootDocment + url,
    method: 'get',
    header: header,
    success: function (res) {
      wx.hideLoading();
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        mask:true,
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })
}
 
function postReq(url,jwt, data, cb) {
  wx.showLoading({
    mask:true,
    title: '处理中...',
  })
  header.Authorization='Bearer '+jwt
    console.log('url',rootDocment + url),
    wx.request({
      url: rootDocment + url,
      header: header,
      data: data,
      method: 'post',
      success: function (res) {
        console.info(res)
        wx.hideLoading();
        return typeof cb == "function" && cb(res.data)
      },
      fail: function (e) {
        console.info(e)
        wx.hideLoading();
        wx.showModal({
          mask:true,
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
        return typeof cb == "function" && cb(false)
      }
    })
 
}
module.exports = {
  getReq: getReq,
  postReq: postReq,
  header: header,
  rootDocment:rootDocment
} 
