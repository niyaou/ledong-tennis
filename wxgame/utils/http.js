const app = getApp()
var rootDocment = 'http://192.168.1.101:8081/';
var header = {
  'Accept': 'application/json',
  'content-type': 'application/x-www-form-urlencoded',
  'Authorization': 'Bearer '+app.globalData.jwt,
}
function getReq(url, jwt,cb) {
  wx.showLoading({
    title: '加载中',
  })
  header.Authorization='Bearer '+jwt
  // console.log("header==")
  //   console.log(header)
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
    title: jwt,
  })
  header.Authorization='Bearer '+jwt
    // console.log("header=="),
    // console.log(header),
    wx.request({
      url: rootDocment + url,
      header: header,
      data: data,
      method: 'post',
      success: function (res) {
        wx.hideLoading();
        return typeof cb == "function" && cb(res.data)
      },
      fail: function () {
        wx.hideLoading();
        wx.showModal({
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
} 
