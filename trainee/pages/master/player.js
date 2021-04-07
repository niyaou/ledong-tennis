// pages/matches/matchlist.js
const app = getApp()
var http = require('../../utils/http.js')
// var compare=require('../../utils/util.js')
const chooseLocation = requirePlugin('chooseLocation');
var pinyin = require('../../utils/pinyinUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    visible: false,
    sortTog:true,
    currentIndex: 0,
    rankPosition: 0,
    fruit: [{
      id: 1,
      name: '按名称',
    }, {
      id: 2,
      name: '按比分'
    }],
    current: '按名称',
    tags: [{
        name: "磨神",
        checked: false
      }, {
        name: "进攻凶猛",
        checked: false
      }, {
        name: "发球大炮",
        checked: false
      }, {
        name: "跑不死",
        checked: false
      }, {
        name: "暴力正手",
        checked: false
      },
      {
        name: "魔鬼切削",
        checked: false
      }, {
        name: "全场进攻",
        checked: false
      }, {
        name: "变化多端",
        checked: false
      }, {
        name: "发球上网",
        checked: false
      }, {
        name: "底线AK47",
        checked: false
      },
    ],
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
    rankPosition: 300,
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
    }, {
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
    }, {
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
  onSortChange(event){
    console.log(event.detail)
    this.setData({
      sortTog:event.detail.value
    })

    if(this.data.sortTog){
      this.setData({
        players:this.data.players.sort((a, b) => {
          return a['position'] - b['position']
        })
      })
    }else{
      this.setData({
        players: this.data.players.sort((a, b) => {
          return  pinyin.pinyinUtil.getFirstLetter(a.nickName.substring(0,1)).toUpperCase() > pinyin.pinyinUtil.getFirstLetter(b.nickName.substring(0,1)).toUpperCase()?1:-1
        })
      })
    }

  },
  onChange(event) {
    const detail = event.detail;
    this.setData({
      ['tags[' + event.detail.name + '].checked']: detail.checked
    })
    console.log(event.detail)
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
    console.log('----ok--', tags)
    let url = 'rank/updateUserTags?tags=' + tags + '&openId=' + this.data.players[this.data.currentIndex].openId
    http.postReq(`${url}`, app.globalData.jwt, {}, (res) => {
      if (res.code === 0) {
        this.data.players[this.data.currentIndex].polygen = tags
        this.setData({
          players: this.data.players
        })
      }
      console.log(res)
    })
    this.setData({
      visible: false
    })
  },
  addMatch(){
    wx.navigateTo({
      url: '../master/create',
    })
  },
  handleTapped(e) {
console.log(e)
wx.navigateTo({
  url: '../master/score?id='+e.currentTarget.dataset.info.openId+'&name='+e.currentTarget.dataset.info.nickName,
})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    this.setData({
      rankPosition: options.rankPosition
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  getTagsFromServe() {
    // tags: [{
    //   name: "磨神",
    //   checked: false
    // },
    let url = 'rank/getTags'
    http.getReq(`${url}`, app.globalData.jwt, (res) => {
      let tags = res.data.tagName.map(t => {
        return {
          name: t,
          checked: false
        }
      })
      this.setData({
        tags: tags
      })
      console.log(res)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('---------player back--------')
    let url = 'rank/rankList?count=500'
    http.getReq(`${url}`, app.globalData.jwt, (res) => {
      this.setData({
        players: res.data.sort((a, b) => {
          return a['position'] - b['position']
        })
      })
      // console.log(this.data.players.map(i => {
      //   return i.position
      // }))
    })
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
    http.getReq('rank/rankPosition', jwt, (e) => {
      this.setData({
        rankPosition: e.data.sort
      })
    })
  },
})