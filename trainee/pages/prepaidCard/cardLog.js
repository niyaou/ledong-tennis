// pages/matches/matchlist.js
const app = getApp()
var http = require('../../utils/http.js')
var util = require('../../utils/util.js')
const {
  $Toast
} = require('../../dist/base/index');
// var compare=require('../../utils/util.js')
// const chooseLocation = requirePlugin('chooseLocation');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    userInfo: getApp().globalData.userInfo,
    visible: false,
    currentIndex: 0,
    balance: 0,
    balanceTimes: 0,
    prepaidCard: '',
    current: '没参加比赛',
    selectCharge: {},
    chargeLogs: [],
    spendLogs: [],
    currentTarget: [],
    actions: [{
      name: '申诉',
      color: '#fff',
      fontsize: '20',
      width: 100,
      icon: 'interactive',
      background: '#ed3f14'
    },
    {
      name: '返回',
      width: 100,
      color: '#80848f',
      fontsize: '20',
      icon: 'undo'
    }
    ],
    players: [],
    slideButtons: [],
  },
  formatTime(time, pattern) {
    console.log(util.stringDateFormat('YYYY-mm-dd HH:MM', time))
    return util.stringDateFormat('YYYY-mm-dd HH:MM', time)
  },
  onChange(event) {
    const detail = event.detail;
    this.setData({
      ['tags[' + event.detail.name + '].checked']: detail.checked
    })
    console.log(event.detail)
  },
  showModalRetreat(e) {
    this.setData({
      visible: true,
      selectCharge: e.target.dataset.log
    })
  },
  handleClose() {
    this.setData({
      visible: false
    })
  },



  handleTapped(e) {
    let userTag = this.data.players[e.detail.index].polygen
    if (typeof userTag === 'undefined') {
      userTag = ''
    }
    let tags = this.data.tags.map(p => {
      p.checked = userTag.indexOf(p.name) > -1
      return p
    })
    this.setData({
      visible: true,
      currentIndex: e.detail.index,
      tags: tags
    })
    console.log(e.detail, this.data.players[e.detail.index])
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady   ------- ')
  },


  getCardLogs(number) {
    let url = `user/charged/${number}`
    http.getReq(`${url}`, (res) => {
      console.log('----res', res)
      this.setData({ chargeLogs: res.content })
    })
  },
  getUserInfo: function (e) {
    http.getReq(`user/?number=${this.data.userInfo.number}`, (e) => {
      this.setData({
        userInfo: e,
      })
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow   ------- ', app.globalData.userInfo)
    this.getCardLogs(app.globalData.userInfo.number)
    this.setData({ userInfo: app.globalData.userInfo })
    this.getUserInfo()
  },

  onCreate: function () {
    console.log('onCreate   ------- ')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { },

})