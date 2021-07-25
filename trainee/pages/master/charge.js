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

    index: 0, //教练index
    coach: [],
    players: [],
    selectPlayers: [],
    text: '',
    coachSpend: 0,
    descript: '',
    sortTog: true,
    courseTime: '', //课程时长
    time: util.formatTime(new Date()),
    experinced: false,
    isDealing: false,
    name: '',
    realName: '',
    id: '',
    prepaidCard:'',
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    visible: false,
    timePoint: 0, //0 :start time ,  1: end time
    startTime: 'N/A',
    endTime: 'N/A',
    coursFee:'',
    array: ['音乐花园', '雅居乐', '英郡', '银泰城', '一品天下', '其他'],
  },
  coursFeeChange(e) {
    this.setData({
      coursFee: e.detail.detail.value
    })
  },
  descriptChange(e) {
    this.setData({
      descript: e.detail.detail.value
    })
  },
  courseTimeChange(e) {
    this.setData({
      courseTime: e.detail.detail.value
    })
  },
  coachSpendChange(e) {
    this.setData({
      coachSpend: e.detail.detail.value
    })
  },
  handleModalCancel(e) {
    this.setData({
      visible: false
    })
  },
  onSortChange(event) {
    this.setData({
      sortTog: event.detail.value,
      coursFee:-this.data.coursFee
    })
  },
  pRemove(e) {
    console.log('ptap', e, this.data.selectPlayers)
    let item = e.target.dataset.id
    let arr = []
    arr = this.data.selectPlayers.filter(i => {
      return i.openId !== item.openId
    })
    this.setData({
      selectPlayers: arr
    })

  },
  pTap(e) {
    let item = e.target.dataset.id
    let duplicated = this.data.selectPlayers.filter(i => {
      return i.openId === item.openId
    }).length > 0
    let arr = []
    this.data.selectPlayers.push(item)
    arr = this.data.selectPlayers
    console.log('ptap', e.target.dataset, item, 'arr:', arr, this.data.selectPlayers)
    if (!duplicated) {
      this.setData({
        selectPlayers: arr
      })
    }
    console.log('ptap', this.data.selectPlayers)
  },
  studentFee(e) {
    console.log('studentFee', e)
    let arr = this.data.selectPlayers.map(s => {
      if (s.openId === e.currentTarget.dataset.id.openId) {
        s.courseSpend = parseInt(e.detail.detail.value)
      }
      return s
    })
    this.setData({
      selectPlayers: arr
    })
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
    // wx.showToast({
    //   title: `${e.detail.date}`,
    //   icon: false
    // })
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
      index : e.detail.value
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
  onExperincedChange(e) {
    console.log('onExperincedChange', e.detail.value)
    this.setData({
      experinced: e.detail.value
    })
  },
  onIsDealingChange(e) {
    console.log('onIsDealingChange', e.detail.value)
    this.setData({
      isDealing: e.detail.value
    })
  },
  handleCreate(e) {
    let url = 'prepaidCard/ld/chargeAnnotation'
  
    http.postReq(`${url}`, app.globalData.jwt, {
      // startTime: this.data.startTime,
      // endTime: this.data.endTime,
      coachId: this.data.coach[this.data.index].openId,
      // isExperience: this.data.experinced?1:0,
      // isDealing: this.data.isDealing?1:0,
      // spendingTime: this.data.courseTime,
      // courtSpend: this.data.coursFee,
      // coachSpend: this.data.coachSpend,
      cardId: this.data.prepaidCard,
      openId: this.data.id,
      amount:this.data.coursFee,
      description:this.data.descript,
    }, (res) => {
      console.log(res)
      if (res.code === 0) {
        wx.showLoading({
          mask:true,
          title: '处理中...',
        })
        setTimeout(() => {
          wx.hideLoading();
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
    console.log(options)
    this.setData({
      prepaidCard:options.prepaidCard,
      id: options.id,
      name: options.name
    })

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