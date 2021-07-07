// pages/matches/matchlist.js
const app = getApp()
var http = require('../../utils/http.js')
var util = require('../../utils/util.js')
// var compare=require('../../utils/util.js')
// const chooseLocation = requirePlugin('chooseLocation');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    visible: false,
    currentIndex: 0,
    balance: 0,
    prepaidCard:'',
    current: '没参加比赛',
    chargeLogs:[],
    spendLogs:[],
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
  formatTime(time,pattern){
    console.log(util.stringDateFormat('YYYY-mm-dd HH:MM',time))
    return util.stringDateFormat('YYYY-mm-dd HH:MM',time)
  },
  onChange(event) {
    const detail = event.detail;
    this.setData({
      ['tags[' + event.detail.name + '].checked']: detail.checked
    })
    console.log(event.detail)
  },

  handleClose1() {
    this.setData({
      visible: false
    })
  },

  handleOk() {
    //更新
    let tags = ''
    this.data.tags.map(t => {
      if (t.checked) {
        if (tags === '') {
          tags += t.name
        } else {
          tags += ',' + t.name
        }
      }
    })
  
    let url = 'rank/updateUserTags?tags=' + tags + '&openId=' + this.data.players[this.data.currentIndex].openId
    http.postReq(`${url}`, app.globalData.jwt, {}, (res) => {
      if (res.code === 0) {
        this.data.players[this.data.currentIndex].polygen = tags
        this.setData({
          players: this.data.players.filter(p=>{return clubId.clubId===app.globalData.userRankInfo.clubId})
        })
      }
      console.log(res)
    })

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
    console.log('onload ',options)
    this.setData({
      prepaidCard: options.cardId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

getCardLogs(){
  let url = 'prepaidCard/ld/finacialLogs?cardId='+this.data.prepaidCard
  http.getReq(`${url}`, app.globalData.jwt, (res) => {
    if(res.code===0){
      let result=JSON.parse(res.data)
      result.forEach(r=>{
        if(typeof r.balance!=='undefined'){
          this.setData({balance:r.balance})
        }else if(typeof r.amount!=='undefined'){
          this.data.chargeLogs.unshift(r)
          this.setData({chargeLogs: this.data.chargeLogs})
        }else if(typeof r.spend!=='undefined'){
          this.data.spendLogs.unshift(r)
          this.setData({spendLogs: this.data.spendLogs})
        }
      })
    }
    console.log(JSON.parse(res.data))

  })
},


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCardLogs()
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
    http.getReq('rank/ldRankPosition', jwt, (e) => {
      this.setData({
        rankPosition: e.data.sort
      })
    })
  },
})