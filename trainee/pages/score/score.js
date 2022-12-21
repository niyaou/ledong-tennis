// pages/matches/matchlist.js
const app = getApp()
var http = require('../../utils/http.js')
var util = require('../../utils/util.js')
var moment = require('../../utils/moment.js')
Page({

  /**
   * 页面的初始数据
   */

  data: {
    total: 0,
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    visible1: false,
    userInfo: getApp().globalData.userInfo,
    calendar: null,

    spotMap: {},
    disabledDate({
      day,
      month,
      year
    }) {
      // 例子，今天之后的日期不能被选中
      const now = new Date();
      const date = new Date(year, month - 1, day);
      return date > now;
    },
    course: [],
    currentCourse: []

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
  // 获取日期数据，通常用来请求后台接口获取数据
  getDateList({
    detail
  }) {
    // console.log(detail, '获取数据');

  },

  // 过滤重复月份请求的方法
  filterGetList({
    setYear,
    setMonth
  }) {
    const dateListMap = new Set(this.data.dateListMap);
    const key = `y${setYear}m${setMonth}`;
    if (dateListMap.has(key)) {
      return false;
    }
    dateListMap.add(key);
    this.setData({
      dateListMap: [...dateListMap],
    });
    return true;
  },
  // 日期改变的回调
  selectDay({
    detail
  }) {
    console.log(detail, 'selectDay detail');
    let _c = this.data.course.filter(c => {
      console.log(`${moment(c.course.startTime).format('YYYY')}`, `${moment(c.course.startTime).format('MM')}`, `${moment(c.course.startTime).format('DD')}`)
      return `${detail.year}` === `${moment(c.startTime).format('YYYY')}` && `${moment(c.startTime).format('MM')}` === `${detail.month}`
    }).map(c=>{return {...c,course:{...c.course,startTime:moment(c.startTime).format('MM-DD HH:mm'),endTime:moment(c.endTime).format('HH:mm')}}})
    console.log('-----', _c)
    this.setData({
      currentCourse: _c
    })
  },
  // 展开收起时的回调
  openChange({
    detail
  }) {
    console.log(detail, 'openChange detail');
  },
  changetime() {
    this.setData({
      changeTime: '2022/1/1',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getCourse() {
    let that = this
    http.getReq(`prepaidCard/spend?number=${this.data.userInfo.number}&startTime=${moment().subtract(180,'days').format('YYYY-MM-DD HH:mm:ss')}`, (res) => {
      // http.getReq(`prepaidCard/course/total?number=${this.data.userInfo.number}&startTime=${moment().subtract(180,'days').format('YYYY-MM-DD HH:mm:ss')}`,(res)=>{

      console.log(res)
      this.setData({
        course: res
      })
      var spot = {}
      res.map(c => {
        spot[`y${moment(c.course.startTime).format('YYYY')}m${moment(c.course.startTime).format('MM')}d${moment(c.course.startTime).format('DD')}`] = 'deep-spot'
        return spot
      })
      this.setData({
        spotMap: spot
      })
    })
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
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.getCourse()
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
  getScoreList() {

    http.getReq(`rank/ld/scoreLog`, app.globalData.jwt, (res) => {
      console.log(res)
      if (res.code == 0 && res.data != null) {
        let logs = res.data.map(l => {
          return {
            text: l.description,
            time: l.rankingTime,
            score: l.score
          }
        })
        this.setData({
          slideButtons: logs
        })
        let total = 0
        logs.map(l => {
          total += l.score
        })
        this.setData({
          total: total
        })
        // slideButtons: [{
        //   text: '与 范大将军 的比赛获胜',
        //   src: '', // icon的路径,
        //   time: '2020-12-21',
        //   result: '',
        //   score: '+30',
        //   toggle: false
        // }
      } else {
        this.setData({
          slideButtons: []
        })
      }
    })
  }

})