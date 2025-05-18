// app.js
App({
  globalData: {
    userInfo: null,
    openid: null
  },
  
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        // env 参数决定接下来小程序发起的云开发调用会默认请求到哪个云环境的资源
        // 此处请填入环境 ID, 环境 ID 可打开云控制台查看
        env: 'cloud1-6gebob4m4ba8f3de',
        traceUser: true,
      })
      
      // 先检查本地存储是否有openid
      const openid = wx.getStorageSync('openid')
      if (openid) {
        // 如果有，直接加载到全局变量
        this.globalData.openid = openid
        console.log('从本地存储加载openid:', openid)
      } else {
        // 如果没有，调用云函数获取
        wx.cloud.callFunction({
          name: "getopenId",
          success: res => {
            const openid = res.result.openid
            // 保存到本地存储
            wx.setStorageSync('openid', openid)
            // 加载到全局变量
            this.globalData.openid = openid
            console.log('获取并保存openid:', openid)
          },
          fail: err => {
            console.error('获取openid失败：', err)
          }
        })
      }
    }
  }
}) 