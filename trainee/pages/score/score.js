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
    spotMap: {
      y2022m5d9: 'deep-spot',
      y2022m5d10: 'spot',
      y2022m6d10: 'spot',
      y2022m7d10: 'spot',
      y2022m8d10: 'spot',
      y2022m10d1: 'spot',
      y2023m5d10: 'spot',
      y2022m12d19: 'deep-spot',
    },
    disabledDate({ day, month, year }) {
      // 例子，今天之后的日期不能被选中
      const now = new Date();
      const date = new Date(year, month - 1, day);
      return date > now;
    },
    // 需要改变日期时所使用的字段
    changeTime: '',
    // 存储已经获取过的日期
    dateListMap: [],
 
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
  // 获取日期数据，通常用来请求后台接口获取数据
  getDateList({ detail }) {
    // 检查是否已经获取过该月的数据
    if (this.filterGetList(detail)) {
      // 获取数据
      console.log(detail, '获取数据');
    }
  },
  // 过滤重复月份请求的方法
  filterGetList({ setYear, setMonth }) {
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
  selectDay({ detail }) {
    console.log(detail, 'selectDay detail');
  },
  // 展开收起时的回调
  openChange({ detail }) {
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
   
    const calendar = this.selectComponent('#calendar').calendar
console.log(calendar)

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

  },
  getScoreList(){

    http.getReq(`rank/ld/scoreLog`, app.globalData.jwt, (res) => {
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