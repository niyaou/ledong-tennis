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
    this.globalData.gps= wx.getStorageSync('gps') || ''
    this.globalData.parentInfo=wx.getStorageSync('parentUserInfo')||{}
    this.globalData.parentRankInfo=wx.getStorageSync('parentRankInfo')||{}
    this.globalData.parentOpenId=wx.getStorageSync('parentOpenId')||''
    this.globalData.childRankInfo=wx.getStorageSync('children')||''
  
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           if(  this.globalData.userInfo === null){
    //             this.globalData.userInfo = res.userInfo
    //             console.log('app -------self set user info ',this.globalData.userInfo)
    //           }
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    shortInterval:SHORTINTERVAL,
    slowInterval:SLOWINTERVAL,
    parentInfo:null,
    parentRankInfo:null,
    childRankInfo:null,
    userList:[],
    userInfo: null,
    userRankInfo:null,
    openId:'',
    totalBarHeight: 750*( wx.getSystemInfoSync()['statusBarHeight'] +44 )/wx.getSystemInfoSync()['windowWidth'],
    statusBarHeight: 750*( wx.getSystemInfoSync()['statusBarHeight']  )/wx.getSystemInfoSync()['windowWidth'],
    ratio: 750 /wx.getSystemInfoSync()['windowWidth'],
    avator:'',
    jwt:'',
    gps:''
  }
})
