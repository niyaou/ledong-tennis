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
    rankPosition:0,
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
      this.getRankPosition(app.globalData.jwt)
      this.gps()
    }
  },
  onShow:function(){
    let that = this
    console.info('---------onshow ---------')
    http.getReq(`match/matchResult`,app.globalData.jwt , (res)=>{
      console.info('1 ---- result',res)
     if(res.code==0 && res.data != null){
       console.info('result',res)
       let message = (that.data.userInfo.openId == res.data.holder)?(res.data.winner==5000?'比赛胜利':'比赛失败')
       :(res.data.winner==5001?'比赛胜利':'比赛失败')
       let other =  (that.data.userInfo.openId == res.data.holderName)?res.data.holder:res.data.challengerName
       let title = `你与${other}的${message}`
      wx.showModal({
        title: '比赛结果',
        content:title,
        cancelColor: 'cancelColor',
      })
     }
    })
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
        console.info(res)
        let jwt =
          http.postReq('user/login', '', {
            token: res.code,
            nickName: that.data.userInfo.nickName,
            avator: that.data.userInfo.avatarUrl,
            gps: `${that.data.userLocation.latitude},${that.data.userLocation.longitude}`
          }, function (e) {
            wx.setStorageSync('jwt', e.data)
            app.globalData.jwt=e.data
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
  getRankPosition(jwt){
    http.getReq('rank/rankPosition', jwt, (e) => {
      this.setData({
        rankPosition:e.data
      })

    })
  },
  getUserRankInfo(jwt) {
    http.getReq('rank/rankInfo', jwt, (e) => {
      this.setData({
        userRankInfo: {
          rankType1: e.data.rankType1,
          rankType0: e.data.rankType0,
          winRate: e.data.winRate
        }
      })
      app.globalData. userRankInfo=this.data.userRankInfo
      app.globalData.openId=e.data.openId
    })
  },
  getNearByUser(jwt) {
    let that = this
    http.getReq(`user/nearby?gps=${this.data.userLocation.latitude},${this.data.userLocation.longitude}`, jwt, (e) => {
  
      that.setData({
        nearByUser: e.data.filter( u => {
          return  u.id !== app.globalData.openId
        })
      })
    })
  },
  getNearByCourt(jwt) {
    let that = this
    http.getReq(`match/court/nearby?gps=${this.data.userLocation.latitude},${this.data.userLocation.longitude}`, jwt, (e) => {
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
    if(event.currentTarget.dataset.gid==0){
      this.getUserRankInfo(app.globalData.jwt)
      this.getRankPosition(app.globalData.jwt)
    }
  }
})