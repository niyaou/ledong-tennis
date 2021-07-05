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
    clubId:0,
    visible: false,
    sortTog: true,
    visible5: false,
    currentUser: '',
    currentIndex: 0,
    rankPosition: 0,
    filterType: 0, // 0 pending    1  verified     2 teenage
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
    totalPlayers: [],
    rankPosition: 300,
    slideButtons: [],
    actions5: [{
        name: '取消'
      },
      {
        name: '验证通过',
        color: '#ed3f14',
        loading: false
      }
    ],
    actions5Dis: [{
      name: '取消'
    }],
    assignedCard: false, //是否绑卡
    actions6: [
      {
        name: '积分',
      }
    ],
    actions6Assigned: [
      {
        name: '积分',
      }
    ]
  },
  realNameChange(e) {
    console.log('--realNameChange--', e.detail.detail.value)
    this.setData({
      realName: e.detail.detail.value
    })
  },
  onSortChange(event) {
    console.log(event.detail)
    this.setData({
      sortTog: event.detail.value
    })

    if (this.data.sortTog) {
      this.setData({
        players: this.data.totalPlayers.sort((a, b) => {
          return a['position'] - b['position']
        }).filter(g => {
          return g['clubId'] === this.data.filterType
        })
      })
    } else {
      this.setData({
        players: this.data.totalPlayers.sort((a, b) => {
          return pinyin.pinyinUtil.getFirstLetter(a.nickName.substring(0, 1)).toUpperCase() > pinyin.pinyinUtil.getFirstLetter(b.nickName.substring(0, 1)).toUpperCase() ? 1 : -1
        }).filter(g => {
          return g['clubId'] === this.data.filterType
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
          totalPlayers: this.data.players,
          players: this.data.players.filter(g => {
            return g['clubId'] === this.data.filterType
          })
        })
      }
      console.log(res)
    })
    this.setData({
      visible: false
    })
  },
  addCourse() {
    wx.navigateTo({
      url: '../course/masterCourse',
    })
  },
  addMatch() {
    if (this.data.filterType === 0) {
      $Toast({
        content: '请选择成人或者儿童',
        type: 'warning'
      });
      return
    }
    wx.navigateTo({
      url: '../master/create?filterType=' + this.data.filterType,
    })
  },
  handleClick5({
    detail
  }) {
    if (detail.index === 0) {
      this.setData({
        visible5: false
      });
    } else {
      wx.showLoading({
        mask: true,
        title: '加载中',
      })
      let url = 'user/ld/verifiedMember'
      let nameUrl = 'user/ldRealName'
      http.postReq(`${url}`, app.globalData.jwt, {
        openId: this.data.currentUser
      }, (res) => {
        wx.hideLoading();
        http.postReq(`${nameUrl}`, app.globalData.jwt, {
          openId: this.data.currentUser,
          realName: this.data.realName
        }, (res) => {
          wx.hideLoading();
          this.setData({
            visible5: false
          });
          setTimeout(() => {
            this.initList()
          }, 1500)
        })
      })
    }
  },
  handleClick6({
    detail
  }) {
    console.log('handleClick6', detail)
    if (detail.index === 0) {
      if(this.data.assignedCard){
        console.log('------app.globalData.parentInfo--------',app.globalData.userRankInfo)
        if( app.globalData.userRankInfo.clubId<4){
          this.setData({
            visible6: false
          })
          console.log('--------------')
          return
        }
        wx.navigateTo({
          url: './charge?id=' + this.data.currentUser.openId + '&name=' + this.data.currentUser.nickName+'&prepaidCard='+this.data.currentUser.prepaidCard,
        })
      }else{
        wx.navigateTo({
          url: '../prepaidCard/masterCard?id=' + this.data.currentUser.openId + '&name=' + this.data.currentUser.nickName,
        })
      }
    } else {
      wx.navigateTo({
        url: '../master/score?id=' + this.data.currentUser.openId + '&name=' + this.data.currentUser.nickName,
      })
    }
    this.setData({
      visible6: false
    })
  },
  handleTapped(e) {
    console.log(e.currentTarget.dataset.info)
    if (e.currentTarget.dataset.info.clubId === 0) {
      this.setData({
        visible5: true,
        currentUser: e.currentTarget.dataset.info.openId
      })
    } else {
      let card = e.currentTarget.dataset.info.prepaidCard

      this.setData({
        assignedCard: typeof card !== 'undefined' && card.length > 0,
        visible6: true,
        currentUser: e.currentTarget.dataset.info
      })



    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      rankPosition: options.rankPosition,
      clubId:parseInt(options.clubId)
    })
if(parseInt(options.clubId)===4){
  let actions6=[...this.data.actions6,{
    name: '绑卡'
  }]
  let actions6Assigned=[...actions6Assigned,{
    name: '积分',
  }]
}
    this.setData({
      actions6:actions6,
      actions6Assigned:actions6Assigned
    })
    console.log('周期函数--监听页面加载    options',this.data.actions6,this.data.actions6Assigned)
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

  navigateTo(event) {
    console.log(event.currentTarget.dataset.variable)
    this.setData({
      filterType: event.currentTarget.dataset.variable
    })
    let e = {}
    e.detail = {
      value: this.data.sortTog
    }
    this.onSortChange(e)


  },

  initList() {
    let url = 'rank/ld/rankList?count=500'
    http.getReq(`${url}`, app.globalData.jwt, (res) => {
      this.setData({
        totalPlayers: res.data,
        players: res.data.sort((a, b) => {
          return a['position'] - b['position']
        }).filter(g => {
          return g['clubId'] === this.data.filterType
        })
      })

    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('---------player back--------')
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