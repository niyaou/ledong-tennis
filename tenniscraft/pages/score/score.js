// pages/matches/matchlist.js
const app = getApp()
var http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total:0,
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    visible1: false,

    slideButtons: [{
      text: '与 范大将军 的比赛获胜',
      src: '', // icon的路径,
      time: '2020-12-21',
      result: '',
      score: '+30',
      toggle: false
    },
    {
      text: '参加新春大师赛获得四名',
      src: '', // icon的路径,
      time: '2021-2-15',
      result: '',
      score: '+160',
      toggle: false
    }],
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
this.getScoreList()
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
  getScoreList(){

    http.getReq(`rank/scoreLog`, app.globalData.jwt, (res) => {
      console.log(res)
      if (res.code == 0 && res.data != null) {
        let logs=res.data.map(l=>{
          return {
            text:l.description,
            time:l.rankingTime,
            score:l.score
          }
        })
this.setData({
  slideButtons:logs
})
let total=0
    logs.map(l=>{
total+=l.score
    })
    this.setData({
      total:total
    })
        // slideButtons: [{
        //   text: '与 范大将军 的比赛获胜',
        //   src: '', // icon的路径,
        //   time: '2020-12-21',
        //   result: '',
        //   score: '+30',
        //   toggle: false
        // }
      }else{
        this.setData({
          slideButtons:[]
        })
      }
    })
  }

})