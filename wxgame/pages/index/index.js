//index.js
//获取应用实例
const app = getApp()
var http = require('../../utils/http.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    ratio: getApp().globalData.ratio,
    tabBarStatus:0 // 栏目标志位 0:技术统计， 1：比赛 ， 2：天梯
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that=this
    if (app.globalData.jwt) {
  
      // app.userInfoReadyCallback = res => {
      //   this.setData({
      //     userInfo:  app.globalData.userInfo ,
      //     hasUserInfo: true
      //   })
      // }
this.getUserInfoByJwt(app.globalData.jwt)


    } 

    

  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
     
    })
    this.login(e.detail.userInfo)
  },
  login( userInfo){
    let that = this
    wx.login({
      success (res) {
          console.log('登录成功！' + JSON.stringify(res))
          console.log('登录成功！' + res.code)
          console.log('登录成功！' + JSON.stringify(userInfo))
          wx.request({
            url: `http://192.168.1.101:8081/user/login`,
            method:'POST',
            data: {
              token: res.code,
              nickName:userInfo.nickName,
              avator:userInfo.avatarUrl
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success:function(e){
              wx.setStorageSync('jwt', e.data.data)
              console.log('注册成功',e);
             that. getUserInfoByJwt(e.data.data)
            },
            fail:function(e){
              console.info('failed',e)
            },
            timeout:6000000
          })
      }
    })
  },
getUserInfoByJwt(jwt){
  http.getReq('user/userinfo',jwt,(e)=>{
    console.info(e)
      this.setData({
      userInfo:  {avatarUrl: e.data.avator,   nickName:e.data.nickName},
      hasUserInfo: true
    })
  })
},

  gps(){
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
      }
     })
    console.info('----gps----')
  },
  tabStatus(event){
    this.setData({
      tabBarStatus:event.currentTarget.dataset.gid
    })
    console.log(event.currentTarget.dataset.gid)
  }
})
