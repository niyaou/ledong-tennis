// app.js
App({
  globalData: {
    userInfo: null,
    openid: null,
    managerList: [],
    eventBus: {
      listeners: {},
      on(event, callback) {
        if (!this.listeners[event]) {
          this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
      },
      emit(event, data) {
        if (this.listeners[event]) {
          this.listeners[event].forEach(callback => callback(data));
        }
      },
      off(event, callback) {
        if (this.listeners[event]) {
          if (callback) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
          } else {
            delete this.listeners[event];
          }
        }
      }
    }
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

      // 先检查本地存储是否有管理员列表
      const managerList = wx.getStorageSync('managerList')
      if (managerList) {
        // 如果有，直接加载到全局变量
        this.globalData.managerList = managerList
        console.log('从本地存储加载管理员列表:', managerList)
      }

      // 调用manager_list云函数获取管理员列表
      wx.cloud.callFunction({
        name: "manager_list",
        success: res => {
          const newManagerList = res.result
          // 保存到本地存储
          wx.setStorageSync('managerList', newManagerList)
          // 加载到全局变量
          this.globalData.managerList = newManagerList
          console.log('获取并保存管理员列表:', newManagerList)
        },
        fail: err => {
          console.error('获取管理员列表失败：', err)
        }
      })
    }
  },


}) 