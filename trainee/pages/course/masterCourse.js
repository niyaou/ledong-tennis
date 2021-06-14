// pages/matches/matchlist.js
const app = getApp()
var http = require('../../utils/http.js')
var util = require('../../utils/util.js')
var pinyin = require('../../utils/pinyinUtil.js')
const {
  $Toast
} = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{
        value: 'USA',
        name: '美国'
      },
      {
        value: 'CHN',
        name: '中国',
        checked: 'true'
      },
      {
        value: 'BRA',
        name: '巴西'
      },
      {
        value: 'JPN',
        name: '日本'
      },
      {
        value: 'ENG',
        name: '英国'
      },
      {
        value: 'FRA',
        name: '法国'
      },
    ],
    index: 0,
    coach: [],
    players: [],
    selectPlayers: [],
    text: '',
    time: util.formatTime(new Date()),
    name: '',
    realName: '',
    id: '',
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    visible: false,
    timePoint: 0, //0 :start time ,  1: end time
    startTime: 'N/A',
    endTime: 'N/A',

    array: ['音乐花园', '雅居乐', '英郡', '银泰城', '一品天下', '其他'],
  },
  handleModalCancel(e) {
    this.setData({
      visible: false
    })
  },
  pTap(e) {
    console.log('ptap', e,this.data.selectPlayers)
    let item = e.target.dataset.id
    let duplicated = this.data.selectPlayers.filter(i => {
      return i.openId === item.openId
    }).length > 0
    let arr = this.data.selectPlayers.push(item)
    if (!duplicated) {
      this.setData({
        selectPlayers: arr
      })
    }
  },
  handleClickS(e) {
    this.setData({
      timePoint: 0
    })
    this.handleClick(e)
  },
  handleClickE(e) {
    this.setData({
      timePoint: 1
    })
    this.handleClick(e)
  },

  handleSelecteDate(e) {
    wx.showToast({
      title: `${e.detail.date}`,
      icon: false
    })
    console.log(e.detail.date)
    this.setData({
      visible: false
    })
    if (this.data.timePoint === 0) {
      this.setData({
        startTime: e.detail.date
      })
    } else {
      this.setData({
        endTime: e.detail.date
      })
    }
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  getCoach() {

    let url = `user/ld/ldUsersByType?type=1`
    http.getReq(`${url}`, app.globalData.jwt, (res) => {
      console.log(res)
      if (res.code === 0) {

        this.setData({
          coach: res.data
        })
      }

    })
  },
  showIndex() {
    this.setData({
      isChoiceOpponent: true
    })
  },
  hideInex() {
    console.log('----------hideInex')
    this.setData({
      isChoiceOpponent: false
    })
  },

  hsChange(e) {
    console.log(e)
    this.setData({
      realName: e.detail.detail.value
    })
    let url = `user/ld/ldUsersByName?name=${e.detail.detail.value}`
    if (e.detail.detail.value === '') {
      return
    }
    http.getReq(`${url}`, app.globalData.jwt, (res) => {
      console.log(res)
      if (res.code === 0) {

        this.setData({
          players: res.data
        })
      }

    })
  },
  csChange(e) {
    console.log(e)
    this.setData({
      text: e.detail.detail.value
    })
  },

  handleClick(e) {
    this.setData({
      visible: true
    })
  },
  handleCreate(e) {
    let url = 'prepaidCard/ld/createCard'
    http.postReq(`${url}`, app.globalData.jwt, {
      openId: this.data.id,
      name: this.data.realName,
    }, (res) => {
      console.log(res)
      if (res.code === 0) {
        setTimeout(() => {
          wx.navigateBack({
            delta: 0,
          })
        }, 1500)

      } else {
        $Toast({
          content: '失败，请重试',
          type: 'error'
        });
      }
    })
  },
  handleAssign(e) {
    let url = 'prepaidCard/ld/assignMember'
    http.postReq(`${url}`, app.globalData.jwt, {
      openId: this.data.id,
      name: this.data.realName,
    }, (res) => {
      console.log(res)
      if (res.code === 0) {
        if (res.data === null) {
          $Toast({
            content: '该卡不存在',
            type: 'error'
          });
        } else {

          setTimeout(() => {
            wx.navigateBack({
              delta: 0,
            })
          }, 1500)
        }



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

  handleTapped(e) {

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
      id: options.id,
      name: options.name
    })
    console.log(this.data)
  },
  pinyin: function () {
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

    this.getCoach()

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