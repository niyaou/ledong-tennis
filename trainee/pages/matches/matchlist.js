// pages/matches/matchlist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    actions : [
      {
          name : '申诉',
          color : '#fff',
          fontsize : '20',
          width : 100,
          icon : 'interactive',
          background : '#ed3f14'
      },
      {
          name : '返回',
          width : 100,
          color : '#80848f',
          fontsize : '20',
          icon : 'undo'
      }
  ],
    slideButtons: [{
      text: 'jerry     vs      范大将军 ',
      src: '6  : 7', // icon的路径,
      time:'2020-12-21',
      result:'失败',
      score:'-30'
    },{
      text: 'jerry     vs      范大将军 ',
      src: '6  : 7', // icon的路径,
      time:'2020-12-21',
      result:'失败',
      score:'-30'
    },{
      text: 'jerry     vs      范大将军 ',
      src: '6  : 7', // icon的路径,
      time:'2020-12-21',
      result:'失败',
      score:'-30'
    },{
      text: 'jerry     vs      范大将军 ',
      src: '6  : 7', // icon的路径,
      time:'2020-12-21',
      result:'失败',
      score:'-30'
    },{
      text: 'jerry     vs      范大将军 ',
      src: '6  : 7', // icon的路径,
      time:'2020-12-21',
      result:'失败',
      score:'-30'
    }],
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