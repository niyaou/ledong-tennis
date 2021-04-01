// pages/matches/matchlist.js
const app = getApp()
var http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    visible1: false,
    openId: '',
    userInfo:app.globalData.userInfo,
    opponentId:'',
    times:0,
    winRate:0,
    fruit: [{
      id: 1,
      name: '没参加比赛',
    }, {
      id: 2,
      name: '比分记错了'
    }],
    current: '没参加比赛',
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
    slideButtons: [{
      text: 'jerry     vs      范大将军 ',
      src: '6  : 7', // icon的路径,
      time: '2020-12-21',
      result: '失败',
      score: '-30',
      toggle: false
    }],
  },
  getH2hList() {
    let jwt = app.globalData.jwt
    http.getReq('match/matchedGames/h2h/200?opponent='+this.data.opponentId, jwt, (e) => {
      console.log(e,app.globalData.userInfo)
      let  times=0
      let    winRate=0
      let opps = e.data.map(d => {
        times+=   (d.winner===5001&& d.challenger===this.data.opponentId) || (d.winner===5000&& d.holder===this.data.opponentId)?0:1
        return {
          name: d.challenger===this.data.opponentId?d.challengerName:d.holderName,
          avator: d.challenger===this.data.opponentId?d.challengerAvator:d.holderAvator,
          text:d.holderName+'   vs   '+d.challengerName ,
          src:d.holderScore+' : '+d.challengerScore, // icon的路径,
          time:d.gamedTime,
          result:(d.winner===5001&& d.challenger===this.data.opponentId) || (d.winner===5000&& d.holder===this.data.opponentId)?'失败':'胜利',
        }
      })

      this.setData({
        slideButtons: opps,
        winRate:parseInt(100*times/opps.length),
        times:times
      })
    })
  },
  handleFruitChange({
    detail = {}
  }) {
    this.setData({
      current: detail.value
    });
  },
  handleClose1() {
    this.setData({
      visible1: false
    })
  },
  handleClickItem2(e) {
    console.log(e.detail, this.data.slideButtons[e.detail.dataIndex].toggle)
    if (e.detail.index === 1) {
      this.data.slideButtons[e.detail.dataIndex].toggle = this.data.slideButtons[e.detail.dataIndex].toggle ? false : true
      this.setData({
        slideButtons: this.data.slideButtons
      });

    } else {
      this.setData({
        visible1: true
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.setData({
      userInfo:app.globalData.userInfo,
      opponentId:options.opponentId
    })
    console.log(options,this.data.userInfo)
   this. getH2hList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onShareAppMessage: function () {

  }
})