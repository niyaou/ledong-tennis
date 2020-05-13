//index.js
//获取应用实例
const app = getApp()
var http = require('../../utils/http.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    userLocation: {},
    userRankInfo: {},
    nearByUser: [],
    nearByCourt: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    ratio: getApp().globalData.ratio,
    tabBarStatus: 1 // 栏目标志位 0:技术统计， 1：比赛 ， 2：天梯
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    let that = this
    if (app.globalData.jwt) {
      this.getUserInfoByJwt(app.globalData.jwt)
      this.getUserRankInfo(app.globalData.jwt)
      this.gps()
    }



  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
    })
    if (Object.keys(this.data.userLocation).length !== 0) {
      this.login()
    }

  },
  login() {
    let that = this
    wx.login({
      success(res) {
        let jwt =
          http.postReq('user/login', '', {
            token: res.code,
            nickName: that.data.userInfo.nickName,
            avator: that.data.userInfo.avatarUrl,
            gps: `${that.data.userLocation.latitude},${that.data.userLocation.longitude}`
          }, function (e) {
            wx.setStorageSync('jwt', e.data)
            app.globalData.jwt=e.data
            console.info('----------set jwt',e.data)
            setTimeout(function () {
              that.getUserInfoByJwt(e.data)
              that.getUserRankInfo(e.data)
            }, 1500)
          })
      }
    })
  },
  getUserInfoByJwt(jwt) {
    http.getReq('user/userinfo', jwt, (e) => {
      this.setData({
        userInfo: {
          avatarUrl: e.data.avator,
          nickName: e.data.nickName
        },
        hasUserInfo: true
      })
    })
  },
  getUserRankInfo(jwt) {
    http.getReq('rank/rankInfo', jwt, (e) => {
      console.info(e.data)
      this.setData({
        userRankInfo: {
          rankType1: e.data.rankType1,
          rankType0: e.data.rankType0,
          winRate: e.data.winRate
        }
      })
      app.globalData. userRankInfo=this.data.userRankInfo
      app.globalData.openId=e.data.openId
      console.info('-------set global openid',e.data.openId)
    })
  },
  getNearByUser(jwt) {
    let that = this
    http.getReq(`user/nearby?gps=${this.data.userLocation.latitude},${this.data.userLocation.longitude}`, jwt, (e) => {
      console.info(e)
      that.setData({
        nearByUser: e.data
      })
    })
  },
  getNearByCourt(jwt) {
    let that = this
    http.getReq(`match/court/nearby?gps=${this.data.userLocation.latitude},${this.data.userLocation.longitude}`, jwt, (e) => {
      console.info(e)
      that.setData({
        nearByCourt: e.data
      })
    })
  },
  gps() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        that.setData({
          userLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
        wx.setStorageSync('gps', `${res.latitude},${res.longitude}`)
        app.globalData.gps=`${res.latitude},${res.longitude}`
        // console.info(that.data.userLocation)
        // console.info(that.data.userInfo)
        if (Object.keys(that.data.userInfo).length !== 0) {
          that.login(that.data.userInfo)
          that.getNearByUser(app.globalData.jwt)
          that.getNearByCourt(app.globalData.jwt)
        }
      }
    })

  },
  tabStatus(event) {
    this.setData({
      tabBarStatus: event.currentTarget.dataset.gid
    })
    console.log(event.currentTarget.dataset.gid)
  }
})