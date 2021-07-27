// pages/matches/matchlist.js
const app = getApp()
var http = require('../../utils/http.js')
// var compare=require('../../utils/util.js')
const chooseLocation = requirePlugin('chooseLocation');
var pinyin = require('../../utils/pinyinUtil.js')
const {
  $Toast
} = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
   day:{},
   week:{},
   month:{},
    time:'',
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



  initList() {
    let url = 'course/ld/courseStatistic'

    http.postReq(`${url}`, app.globalData.jwt, {},(res) => {
      let time = res.data.day
      
      this.setData({
        time:time,
        day:{
        incoming:res.data.aggsD.filter(r=>{return r.name==='incoming'})[0].value,
        earned:res.data.aggsD.filter(r=>{return r.name==='earned'})[0].value,
        courtSpend:res.data.aggsD.filter(r=>{return r.name==='courtSpend'})[0].value,
        coachSpend:res.data.aggsD.filter(r=>{return r.name==='coachSpend'})[0].value,
      },
     week: {
        time:time,
        incoming:res.data.aggW.filter(r=>{return r.name==='incoming'})[0].value,
        earned:res.data.aggW.filter(r=>{return r.name==='earned'})[0].value,
        courtSpend:res.data.aggW.filter(r=>{return r.name==='courtSpend'})[0].value,
        coachSpend:res.data.aggW.filter(r=>{return r.name==='coachSpend'})[0].value,
      },
     month: {
        time:time,
        incoming:res.data.aggM.filter(r=>{return r.name==='incoming'})[0].value,
        earned:res.data.aggM.filter(r=>{return r.name==='earned'})[0].value,
        courtSpend:res.data.aggM.filter(r=>{return r.name==='courtSpend'})[0].value,
        coachSpend:res.data.aggM.filter(r=>{return r.name==='coachSpend'})[0].value,
      }
    }
      )

    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
    this.initList()
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
  onShareAppMessage: function () {},
  getRankPosition(jwt) {
    http.getReq('rank/ld/rankPosition', jwt, (e) => {
      this.setData({
        rankPosition: e.data.sort
      })
    })
  },
})