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
    totalScore:0,
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
    slideButtons: [],
  },
  addMatch(){
    wx.navigateTo({
      url: '../create/create',
    })
  },
  handleFruitChange({ detail = {} }) {
    this.setData({
        current: detail.value
    });
},
  handleClose1(){
    this.setData({visible1:false})
  },
  handleClickItem2(e) {
    console.log(e.detail, this.data.slideButtons[e.detail.dataIndex].toggle)
    if (e.detail.index === 1) {
      this.data.slideButtons[e.detail.dataIndex].toggle = this.data.slideButtons[e.detail.dataIndex].toggle ? false : true
      this.setData({
        slideButtons: this.data.slideButtons
      });

    }else{
      this.setData({visible1:true})
    }

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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
this.getMatchList()
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

  },

  getMatchList(){
  let jwt=  app.globalData.jwt
  http.getReq('match/matchedGames/200', jwt, (e) => {
    let score=0
    let lists= e.data.filter(f=>{
      return typeof f.holderScore!=='undefined'
    }).map( m=>{
      score+=(m.winner===5001&&m.challenger===app.globalData.openId) ||  (m.winner===5000&&m.holder===app.globalData.openId)?30:-30
      return {text:m.holderName+"  vs  "+m.challengerName,
      src:m.holderScore+"  :  "+m.challengerScore,
      time:m.gamedTime,
      result: (m.winner===5001&&m.challenger===app.globalData.openId) ||  (m.winner===5000&&m.holder===app.globalData.openId)?"胜利":"失败",
      score:(m.winner===5001&&m.challenger===app.globalData.openId) ||  (m.winner===5000&&m.holder===app.globalData.openId)?'  +30':'  -30',
      toggle: false
      }
    })
    // slideButtons
    
    this.setData({
      slideButtons:lists,
      totalScore:score
    })
    console.log('--------1------',e)
  })
  }
})