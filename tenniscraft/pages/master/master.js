const app = getApp()
var http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    isUserList: true,
    players: [],
    userList: [],
    matchList:[],
    count: 100,
    total: 0
  },


  onShow: function () {
    let that = this
    this.refreshUser()
    this.getUserList()
    this.getMatchList()
    http.getReq(`rank/totalUser`, app.globalData.jwt, (res) => {
      that.setData({
        total: res.data
      })
    })
  },
  refreshUser() {
    let that = this
    http.getReq(`rank/rankNewList?count=${this.data.count}`, app.globalData.jwt, (res) => {
      that.setData({
        players: res.data
      })
    })
  },
rank(){
  this.setData({
    isUserList:true
  })
},
match(){
  this.setData({
    isUserList:false
  })
},
  getUserList() {
    let that = this
    http.getReq(`user/userList`, app.globalData.jwt, (res) => {
      console.log('userlist ', res.data)
      that.setData({
        userList: res.data
      })
    })
  },
  getMatchList() {
    let that = this
    http.getReq(`match/getStartMatch`, app.globalData.jwt, (res) => {
      console.log('getStartMatch ', res.data)
      that.setData({
        matchList: res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  bindManual(e) {
    let res = this.data.players
    let index = e.currentTarget.dataset.index
    res[index].score = e.detail.value
    this.setData({
      players: res
    })
  },
  backtoIndex() {
    wx.navigateBack({
      complete: (res) => {},
    })
  },
  detail(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    if (app.globalData.openId !== this.data.holder) {
      wx.showModal({
        content: `是否修改${that.data.players[index].holderName}的分数为${that.data.players[index].score}  ||             0-2600：青铜，-3600：白银，-5000：黄金，以上 钻石`,
        success: (res) => {
          if (res.confirm) {
            http.postReq(`rank/updateUserScore`, app.globalData.jwt, {
              openId: that.data.players[index].openId,
              score: that.data.players[index].score
            }, (res) => {
              if (res.code !== 0) {
                wx.showToast({
                  title: res.message,
                  icon: 'none',
                  duration: 1500
                })
              } else {
                that.refreshUser()
              }
            })
          } else if (res.cancel) {

          }

        }
      })
    }

  }



})