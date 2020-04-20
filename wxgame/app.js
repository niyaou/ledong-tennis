//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    totalBarHeight: 750*( wx.getSystemInfoSync()['statusBarHeight'] +44 )/wx.getSystemInfoSync()['windowWidth'],
    statusBarHeight: 750*( wx.getSystemInfoSync()['statusBarHeight']  )/wx.getSystemInfoSync()['windowWidth'],
    ratio: 750 /wx.getSystemInfoSync()['windowWidth']
  }
})



// tabbar
// "tabBar": {
  //   "color":"#8a8a8a",
  //   "selectedColor":"#a5d116",
  //   "list": [
  //     {
  //       "pagePath": "pages/index/index",
  //       "text": "首页",
  //       "iconPath":"icon/user3.png",
  //       "selectedIconPath":"icon/user-s.png"
  //     },
  //     {
  //       "pagePath": "pages/match/match",
  //       "text": "比赛",
  //       "iconPath":"icon/match.png",
  //       "selectedIconPath":"icon/match-s.png"
  //     },
  //     {
  //       "pagePath": "pages/ladder/ladder",
  //       "text": "排行",
  //       "iconPath":"icon/ladder.png",
  //       "selectedIconPath":"icon/ladder-s.png"
  //     }
  //   ]
  // },