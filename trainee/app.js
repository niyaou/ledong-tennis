// ,
// "pages/prepaidCard/cardLog"
  // "pages/master/exploreMember"
const SHORTINTERVAL=2000
const SLOWINTERVAL=4000
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData.jwt= wx.getStorageSync('jwt') || ''
    this.globalData.number= wx.getStorageSync('number') || ''
  },
  globalData: {
    shortInterval:SHORTINTERVAL,
    slowInterval:SLOWINTERVAL,
    number:'',
    totalBarHeight: 750*( wx.getSystemInfoSync()['statusBarHeight'] +44 )/wx.getSystemInfoSync()['windowWidth'],
    statusBarHeight: 750*( wx.getSystemInfoSync()['statusBarHeight']  )/wx.getSystemInfoSync()['windowWidth'],
    ratio: 750 /wx.getSystemInfoSync()['windowWidth'],
    avator:'',
    jwt:'',
  }
})
