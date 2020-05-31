//index.js
//获取应用实例
const app = getApp()
var http = require('../../utils/http.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {nickName:"请登录",avatarUrl:"../../icon/user2.png"},
    userLocation: {},
    userRankInfo: {rankType0:'暂无'},
    vsCode: '',
    nearByUser: [],
    rankPosition: 0,
    nearByCourt: [],
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    ratio: getApp().globalData.ratio,
    tabBarStatus: 1 // 栏目标志位 0:技术统计， 1：比赛 ， 2：天梯
  },
  //事件处理函数
  bindViewTap: function () {
    this.setData({hasUserInfo:false})
    return 
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
  onShow: function () {
    let that = this
    console.info('---------onshow ---------')
    if (!this.data.hasUserInfo) {
      return
    }
    http.getReq(`match/matchResult`, app.globalData.jwt, (res) => {
      console.info('1 ---- result', res)
      if (res.code == 0 && res.data != null) {
        console.info('app.globalData', app.globalData)
        let message = (app.globalData.openId == res.data.holder) ? (res.data.winner == 5000 ? '比赛胜利' : '比赛失败') :
          (res.data.winner == 5001 ? '比赛胜利' : '比赛失败')
        let other = (app.globalData.openId !== res.data.holder) ? res.data.holderName : res.data.challengerName
        let title = `你与${other}的${message}`
        wx.showModal({
          title: '比赛结果',
          content: title
        })
      }
    })
    var matchComp = this.selectComponent('#match');
    if (matchComp != null) {
      matchComp.tapTabStatus({
        currentTarget: {
          dataset: {
            gid: matchComp.data.tabStatus
          }
        }
      })
    }

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    console.info('------getUserInfo', e)
    this.setData({
      userInfo: e.detail.userInfo,
    })
    this.verified()
  },
  verified() {
    let that = this
    wx.login({
      success(res) {
        console.info('wxlogin   ', res)
        http.postReq('user/verified', '', {
          token: res.code,
        }, function (e) {
          that.setData({
            vsCode: e.data
          })
        })
      }
    })
  },
  login() {
    let that = this
      http.postReq('user/login', '', {
        token:  that.data.openId,
        nickName: that.data.userInfo.nickName,
        avator: that.data.userInfo.avatarUrl,
        gps: `${that.data.userLocation.latitude},${that.data.userLocation.longitude}`
      }, function (e) {
        wx.setStorageSync('jwt', e.data)
        if (e.code == 0) {
          app.globalData.jwt = e.data
          setTimeout(function () {
            that.gps()
            that.getUserInfoByJwt(e.data)
            that.getUserRankInfo(e.data)
            that.getNearByCourt(app.globalData.jwt)
            that. getNearByUser(app.globalData.jwt)
          }, 1500)
        }



      })
  },
  getPhoneNumber(e) {
    let that = this
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    http.postReq('user/phone', '', {
      vscode: this.data.vsCode,
      iv: e.detail.iv,
      data: e.detail.encryptedData,

    }, function (e) {
      console.log('getPhoneNumber',e)
      let jsonData=JSON.parse(e.data)
      if (e.code == 0) {
        that.setData({
          openId:jsonData.purePhoneNumber,
        })
        console.log('purePhoneNumber id',that.data.openId)
        that.login()
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
  getRankPosition(jwt) {
    http.getReq('rank/rankPosition', jwt, (e) => {
      this.setData({
        rankPosition: e.data
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
      app.globalData.userRankInfo = this.data.userRankInfo
      app.globalData.openId = e.data.openId
      console.info('app.globalData.openId', app.globalData.openId)
    })
  },
  getNearByUser(jwt) {
    let that = this
    http.getReq(`user/nearby?gps=${this.data.userLocation.latitude},${this.data.userLocation.longitude}`, jwt, (e) => {

      that.setData({
        nearByUser: e.data.filter(u => {
          return u.id !== app.globalData.openId
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
        that.setData({
          userLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
        wx.setStorageSync('gps', `${res.latitude},${res.longitude}`)
        app.globalData.gps = `${res.latitude},${res.longitude}`
   
        // if (Object.keys(that.data.userInfo).length !== 0) {
        //   // that.verified(that.data.userInfo)
        //   that.getNearByUser(app.globalData.jwt)
        //   that.getNearByCourt(app.globalData.jwt)
        // }
      }
    })

  },
  tabStatus(event) {
    this.setData({
      tabBarStatus: event.currentTarget.dataset.gid
    })
    if (event.currentTarget.dataset.gid == 0) {
      this.getUserRankInfo(app.globalData.jwt)
      this.getRankPosition(app.globalData.jwt)
      this.getNearByCourt(app.globalData.jwt)
      this. getNearByUser(app.globalData.jwt)
    }
  }
})