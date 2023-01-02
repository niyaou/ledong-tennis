//index.js
//获取应用实例
const app = getApp()
var http = require('../../utils/http.js')
const {
  $Toast
} = require('../../dist/base/index');
Page({
  data: {
    version: '2.0.2',
    number: getApp().globalData.number,
    userInfo: getApp().globalData.userInfo,

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
    console.log('--------setStorageSync------', e.detail.value)
    console.log('--------get------', wx.getStorageSync('number'))
  },
  //事件处理函数
  bindViewTap: function () {
    this.setData({
      hasUserInfo: false
    })
    console.log('bindViewTap---hasuserinfo', this.data.hasUserInfo)
    return
  },

  initPlayerInfo() {
  },
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (app.globalData.number) {
      this.getUserInfo()
    }
  },
  onShow: function () {
    console.log('------number', this.data.number)
    this.getUserInfo()
  },

  checkingLogin() {
    return this.data.userInfo.name !== "请登录"
  },
  returnMainPage() {
    this.setData({
      hasUserInfo: true,
      userInfo: {
        name: "请登录",
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
      console.log('--loginClick-----', this.data.hasUserInfo)
    }
  },
  onConfirmEmitted() { },


  getUserInfo: function (e) {
    http.getReq(`user/?number=${this.data.number}`, (e) => {
      console.log('0--------', e)
      if (!e) {
        this.setData({
          userInfo:   {
            name: "请登录",
            avatarUrl: "../../icon/user2.png"
          },
        })
        wx.showModal({
          mask: true,
          title: '绑定失败',
          content: '输入的电话未登记，请联系教练处理',
          showCancel: false
        })
        return
      }
      this.setData({
        userInfo: e,
        hasUserInfo: true,
      })
      app.globalData.userInfo = e
    })

  },








  logout() {
    wx.clearStorage({
      success: (res) => {
        app.globalData.number = ''
        app.globalData.userInfo = {
          name: "请登录",
          avatarUrl: "../../icon/user2.png"
        }
        this.setData({
          userInfo: {
            name: "请登录",
            avatarUrl: "../../icon/user2.png"
          },
          hasUserInfo: false,
        })

      },
    })
  },
  getNearByUser(jwt) {

  },
  getNearByCourt(jwt) {

  },




  navigateTo(event) {
    if (this.data.userInfo.name === '请登录') {
      this.setData({
        hasUserInfo: false
      })
      console.log('------navigateTo-----', this.data.hasUserInfo)
      return
    }

    if (event.currentTarget.dataset.variable === -1) {
      wx.navigateTo({
        url: '../../pages/teenage/create'
      })
    } else
      if (event.currentTarget.dataset.variable === 0) {
        wx.navigateTo({
          url: '../../pages/prepaidCard/cardLog?cardId=' + this.data.userInfo.prepaidCard
        })
      } else if (event.currentTarget.dataset.variable === 1) {
        wx.navigateTo({
          url: '../../pages/score/score'
        })
      }
  },
})