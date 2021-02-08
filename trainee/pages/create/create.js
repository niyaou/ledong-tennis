// pages/matches/matchlist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    visible: false,
    fruit: [{
      id: 1,
      name: '没参加比赛',
  }, {
      id: 2,
      name: '比分记错了'
  }],
  current: '没参加比赛',
  tags:[{ name :"磨神",
  checked : false},{ name :"进攻凶猛",
  checked : false},{ name :"发球大炮",
  checked : false},{ name :"跑不死",
  checked : false},{ name :"暴力正手",
  checked : false},
  { name :"魔鬼切削",
  checked : false},{ name :"全场进攻",
  checked : false},{ name :"变化多端",
  checked : false},{ name :"发球上网",
  checked : false},{ name :"底线AK47",
  checked : false},],
  currentTarget:[],
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
    slideButtons: [{
      text: '范大将军 ',
      src: '范大将军', // icon的路径,
      time: '黄金 段位',
      result: '第1',
      score: '-30',
      toggle: false
    }, {
      text: 'jerry',
      src: 'jerry', // icon的路径,
      time: '黄金段位',
      result: '第2',
      score: '-30',
      toggle: false
    },{
      text: '小鱼儿 ',
      src: '小鱼儿', // icon的路径,
      time: '黄金 段位',
      result: '第1',
      score: '-30',
      toggle: false
    }, {
      text: 'jerry',
      src: 'jerry', // icon的路径,
      time: '黄金段位',
      result: '第2',
      score: '-30',
      toggle: false
    },{
      text: '范大将军 ',
      src: '范大将军', // icon的路径,
      time: '黄金 段位',
      result: '第1',
      score: '-30',
      toggle: false
    }, {
      text: 'jerry',
      src: 'jerry', // icon的路径,
      time: '黄金段位',
      result: '第2',
      score: '-30',
      toggle: false
    }],
  },
  onChange(event){
    const detail = event.detail;
        this.setData({
            ['tags['+event.detail.name+'].checked'] : detail.checked
        })
  },
  handleFruitChange({ detail = {} }) {
    this.setData({
        current: detail.value
    });
},
  handleClose1(){
    this.setData({visible:false})
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
console.log(app.globalData)
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