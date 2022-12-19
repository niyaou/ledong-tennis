//index.js
//获取应用实例
const app = getApp()
var http = require('../../utils/http.js')
const {
  $Toast
} = require('../../dist/base/index');
Page({
  data: {
    version: '1.1.8',

    number:getApp().globalData.number,
    userInfo: {
      nickName: "请登录",
      avatarUrl: "../../icon/user2.png"
    },

    vsCode: '',


    isSingle: true,
    hasUserInfo: true,

    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    ratio: getApp().globalData.ratio,
    tabBarStatus: 1, // 栏目标志位 0:技术统计， 1：比赛 ， 2：天梯,

  },
  bindKeyInput: function (e) {
    this.setData({
      number: e.detail.value
    })
    wx.setStorageSync('number', e.detail.value)
    console.log('--------setStorageSync------',e.detail.value)
    console.log('--------get------',wx.getStorageSync('number'))
  },
  //事件处理函数
  bindViewTap: function () {
    this.setData({
      hasUserInfo: false
    })
    console.log('bindViewTap---hasuserinfo',this.data.hasUserInfo)
    return
  },

  initPlayerInfo() {
  },
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (app.globalData.jwt) {
      this.initPlayerInfo()
    }
  },
  onShow: function () {
console.log('------number',this.data.number)
    if (app.globalData.jwt) {
      this.initPlayerInfo()
    }
  },
  checkingLogin() {
    return this.data.userInfo.nickName !== "请登录"
  },
  returnMainPage() {
    this.setData({
      hasUserInfo: true,
      userInfo: {
        nickName: "请登录",
        avatarUrl: "../../icon/user2.png"
      },
      vsCode: ''
    })
    app.globalData.userInfo = null
    wx.removeStorageSync('parentUserInfo')

  },
  loginClick() {
    if (this.checkingLogin()) {
      return
    } else {
      this.setData({
        hasUserInfo: false
      })
      console.log('--loginClick-----',this.data.hasUserInfo)
    }
  },
  onConfirmEmitted() { },


  getUserInfo: function (e) {
    // wx.getUserProfile({
    //   desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //   success: (res) => {
    //     app.globalData.userInfo = res.userInfo
    //     this.setData({
    //       userInfo: res.userInfo,
    //     })
    //     wx.setStorageSync('parentUserInfo', res.userInfo)
    //     wx.setStorageSync('hasUserInfo',true)
    //     this.verified()
    //     this.gps()
    //   }
    // })

  },
  verified() {
    let that = this
    wx.login({
      success(res) {
        http.postReq('user/ldVerified', '', {
          token: res.code,
        }, function (e) {
          that.setData({
            vsCode: e.data
          })
        })
      }
    })
  },
  login(user) {
    let that = this
    let parent = {
      token: that.data.openId,
      nickName: that.data.userInfo.nickName,
      avator: that.data.userInfo.avatarUrl,
      gps: `${that.data.userLocation.latitude},${that.data.userLocation.longitude}`
    }
    if (typeof user !== "undefined") {
      parent = user
    }
    http.postReq('user/ldLogin', '', parent, function (e) {
      wx.setStorageSync('jwt', e.data)
      if (e.code == 0) {
        app.globalData.jwt = e.data
        wx.showLoading({
          mask: true,
          title: '加载中',
        })
        setTimeout(function () {
          that.initPlayerInfo()
        }, 1500)
      }
    })
  },

  getUserInfoByJwt(jwt) {
    http.getReq('user/ldUserinfo', jwt, (e) => {
      this.setData({
        userInfo: {
          avatarUrl: e.data.avator,
          nickName: e.data.nickName,
          prepaidCard:e.data.prepaidCard
        },
        hasUserInfo: true,
      })
      app.globalData.userInfo = this.data.userInfo
      console.log('---set app global user info ', app.globalData.userInfo)
      if (e.data.avator.indexOf('teenage') === -1) {
        app.globalData.parentInfo = {
          avatarUrl: e.data.avator,
          nickName: e.data.nickName,
          gps: e.data.gps,
          prepaidCard:e.data.prepaidCard,
        }
        this.setData({
          parentUserInfo: e.data
        })
      }
    })
  },


  getNearByUser(jwt) {

  },
  getNearByCourt(jwt) {

  },




  navigateTo(event) {
    // if (!this.checkingLogin()) {
    //   this.setData({
    //     hasUserInfo: false
    //   })
    //   console.log('------navigateTo-----',this.data.hasUserInfo)
    //   return
    // }

    if (event.currentTarget.dataset.variable === -1) {
      // if (parseInt(this.data.userRankInfo.clubId) !== 1) {
      //   $Toast({
      //     content: '请切换到家长账号',
      //     type: 'warning'
      //   });
      // } else {
        wx.navigateTo({
          url: '../../pages/teenage/create'
        })
 

    } else
      if (event.currentTarget.dataset.variable === 0) {
        wx.navigateTo({
          url: '../../pages/prepaidCard/cardLog?cardId='+this.data.userInfo.prepaidCard
        })
      } else        if (event.currentTarget.dataset.variable === 1) {
          wx.navigateTo({
            url: '../../pages/score/score'
          })
        } 
        // else         if (event.currentTarget.dataset.variable === 2) {
   
        //     wx.navigateTo({
        //       url: '../../pages/player/player?rankPosition=' + this.data.rankPosition
        //     })
        //   } else            if (event.currentTarget.dataset.variable === 3) {
        //       wx.navigateTo({
        //         url: '../../pages/h2h/h2h?winRate=' + this.data.userRankInfo.winRate
        //       })
        //     }
 
  },
})