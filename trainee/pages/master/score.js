// pages/matches/matchlist.js
const app = getApp()
var http = require('../../utils/http.js')
var util = require('../../utils/util.js')
var pinyin = require('../../utils/pinyinUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score:0,
    text:'',
    time:util.formatTime(new Date()),
    name:'',
    id:'',
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    visible: false,
  },
  hsChange(e){
    console.log(e)
    this.setData({
      score: parseInt(e.detail.detail.value)
    })
  },
  csChange(e){
    console.log(e)
    this.setData({
      text: e.detail.detail.value
    })
  },

  handleClick(e){
    let url = 'rank/updateUserScore'
    http.postReq(`${url}`, app.globalData.jwt, {openId:this.data.id,score:this.data.score,description:this.data.text}, (res) => {
      console.log(res)
      if (res.code === 0) {
        setTimeout(()=>{
          wx.navigateBack({
            delta: 0,
          })
        },1500)
      
      }

    })
  },
  // finishMatch(matchId){
  //   let url = 'match/matchResult/'+matchId
  //   console.log('finishMatch', {holderScore:this.data.holderScore,challengerScore:this.data.challengerScore})
  //   http.postReq(`${url}`, app.globalData.jwt, {holderScore:this.data.holderScore,challengerScore:this.data.challengerScore}, (res) => {
  //     console.log(res)
  //     wx.hideLoading();
  //     if (res.code === 0) {
  //       wx.navigateBack({
  //         delta: 0,
  //       })
  //     }

  //     // console.log(res)
  //   })
  // },

  handleTapped(e){
    // this.setData({visible:true})
    console.log(e.detail)
    wx.navigateTo({
      url: './detail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.pinyin();
    this.setData({
      id:options.id,
      name:options.name
    })
    console.log(this.data)
  },
  pinyin:function(){
    var char = "使";
 
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