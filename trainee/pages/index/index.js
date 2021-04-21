//index.js
//获取应用实例
const app = getApp()
var http = require('../../utils/http.js')
const chooseLocation = requirePlugin('chooseLocation');
const {
  $Toast
} = require('../../dist/base/index');
Page({
  data: {
    version: '1.0.0',
    motto: 'Hello World',
    userInfo: {
      nickName: "请登录",
      avatarUrl: "../../icon/user2.png"
    },
    userLocation: {},
    userRankInfo: {
      rankType0: '暂无'
    },
    isShowAppendChild: false,
    vsCode: '',
    matchCount: 0,
    nearByUser: [],
    rankPosition: 0,
    opponents: [],
    parentUserInfo: getApp().globalData.parentInfo,
    parentRankInfo: getApp().globalData.parentRankInfo,
    teenage: [],
    nearByCourt: [],
    tags: [],
    isSingle: true,
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    ratio: getApp().globalData.ratio,
    tabBarStatus: 1, // 栏目标志位 0:技术统计， 1：比赛 ， 2：天梯,
    userList: []
  },
  //事件处理函数
  bindViewTap: function () {
    this.setData({
      hasUserInfo: false
    })
    return
  },

  initPlayerInfo() {
    this.getUserInfoByJwt(app.globalData.jwt)
    this.getUserRankInfo(app.globalData.jwt)
    this.gps()
  },
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
    let updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate((e) => {
      if (e.hasUpdate) {
        updateManager.applyUpdate()
      }
    })
    let that = this
    if (app.globalData.jwt) {
      this.initPlayerInfo()

    }

  },
  onShow: function () {
    let that = this
    if (app.globalData.jwt) {
      this.initPlayerInfo()
    }
  },
  checkingLogin() {
    return this.data.userInfo.nickName !== "请登录"
  },
  loginClick() {
    if (this.checkingLogin()) {
      return
    } else {
      this.setData({
        hasUserInfo: false
      })
    }
  },
  onConfirmEmitted() {},
  onLocationTapped(e) {
    const key = 'YIGBZ-BKCRF-JI5JV-NZ6JF-A5ANT-LSF2T'; //使用在腾讯位置服务申请的key
    const referer = 'dd'; //调用插件的app的名称

    const location = JSON.stringify({
      latitude: e.detail[0].courtGPS ? e.detail[0].courtGPS.split(',')[0] : app.globalData.gps.split(',')[0],
      longitude: e.detail[0].courtGPS ? e.detail[0].courtGPS.split(',')[1] : app.globalData.gps.split(',')[1],
    });
    const category = '体育户外,体育场馆,';
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`,
      success: function (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          data: res
        })
      }
    })
  },
  getTotalGames(jwt) {
    http.getReq('match/ld/matchedGames/count', jwt, (e) => {
      this.setData({
        matchCount: e.data
      })
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    console.log('-------getUserInfo---set global user info ',   app.globalData.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
    })
    console.log('-------getUserInfo', e.detail.userInfo)
    wx.setStorageSync('parentUserInfo', e.detail.userInfo)
    this.verified()
  },
  verified() {
    let that = this
    wx.login({
      success(res) {
        http.postReq('user/ldVerified', '', {
          token: res.code,
        }, function (e) {
          that.setData({
            vsCode: e.data
          })
        })
      }
    })
  },
  login(user) {
    let that = this
    let parent = {
      token: that.data.openId,
      nickName: that.data.userInfo.nickName,
      avator: that.data.userInfo.avatarUrl,
      gps: `${that.data.userLocation.latitude},${that.data.userLocation.longitude}`
    }
    if (typeof user !== "undefined") {
      parent = user
    }
    http.postReq('user/ldLogin', '', parent, function (e) {
      wx.setStorageSync('jwt', e.data)
      if (e.code == 0) {
        app.globalData.jwt = e.data
        wx.showLoading({
          mask: true,
          title: '加载中',
        })
        setTimeout(function () {
          that.initPlayerInfo()
        }, 1500)
      }
    })
  },
  getPhoneNumber(e) {
    let that = this
    http.postReq('user/phone', '', {
      vscode: this.data.vsCode,
      iv: e.detail.iv,
      data: e.detail.encryptedData,
    }, function (e) {
      let jsonData = JSON.parse(e.data)
      if (e.code == 0) {
        that.setData({
          openId: jsonData.purePhoneNumber,
        })
        wx.setStorageSync('parentOpenId', that.data.openId)
        app.globalData.parentOpenId = that.data.openId
        that.login()
      }
    })
  },
  getUserInfoByJwt(jwt) {
    http.getReq('user/ldUserinfo', jwt, (e) => {
      this.setData({
        userInfo: {
          avatarUrl: e.data.avator,
          nickName: e.data.nickName
        },
        hasUserInfo: true,
      })
      app.globalData.userInfo=this.data.userInfo
      console.log('---set app global user info ', app.globalData.userInfo)
      if (e.data.avator.indexOf('teenage') === -1) {
        app.globalData.parentInfo = {
          avatarUrl: e.data.avator,
          nickName: e.data.nickName,
          gps: e.data.gps
        }
        this.setData({
          parentUserInfo: e.data
        })
      }
    })
  },
  getTeenage(jwt) {
    if (this.data.userRankInfo.clubId === 2) {
     
      this.setData({
        teenage: app.globalData.childRankInfo.filter(i=>{return i.openId!==this.data.userRankInfo.openId})
      })
    } else if (this.data.userRankInfo.clubId === 1) {
      http.getReq('user/ld/exploreTeenage', jwt, (e) => {
        if (e.code === 0 && e.data.length > 0) {
          this.setData({
            teenage: e.data !== null ? e.data.filter(t => {
              return t.parent.indexOf(app.globalData.openId) > -1
            }) : []
          })
          app.globalData.childRankInfo = this.data.teenage
          wx.setStorageSync('children', this.data.teenage)
        }
      })
    }

  },
  getOpponentCount(jwt) {
    http.getReq('match/ld/matchedGames/h2h/opponent', jwt, (e) => {
      this.setData({
        opponents: e.data !== null ? e.data : []
      })
    })
  },
  getRankPosition(jwt) {
    http.getReq('rank/ldRankPosition', jwt, (e) => {
      this.setData({
        rankPosition: e.data
      })
    })
  },
  getUserRankInfo(jwt) {
    let that = this
    http.getReq('rank/ldRankInfo', jwt, (e) => {
      let tags = []
      if (typeof e.data.polygen !== 'undefined' && e.data.polygen !== null) {
        tags = e.data.polygen.split(',')
      }
      if (tags[0] === '') {
        tags = tags.splice(1, tags.length)
      }
      this.setData({
        userRankInfo: {
          openId:e.data.openId,
          rankType1: e.data.rankType1,
          rankType0: e.data.rankType0,
          doubleRankType1: e.data.doubleRankType1,
          doubleRankType0: e.data.doubleRankType0,
          winRate: e.data.winRate,
          score: e.data.score,
          doubleRankPosition: e.data.doublePosition,
          doubleWinRate: e.data.doubleWinRate,
          doubleScore: e.data.doubleScore,
          tags: tags,
          parent: e.data.parent,
          clubId: e.data.clubId
        },
        rankPosition: e.data.position
      })
      console.log('-------get user rank info ', this.data.userRankInfo)
      app.globalData.userRankInfo = this.data.userRankInfo
      app.globalData.openId = e.data.openId
      if (parseInt(that.data.userRankInfo.clubId) === 1) {
        app.globalData.parentRankInfo = this.data.userRankInfo
        wx.setStorageSync('parentRankInfo', app.globalData.userRankInfo)
        that.setData({
          parentRankInfo: app.globalData.userRankInfo
        })
      } else if (parseInt(that.data.userRankInfo.clubId) === 2) {
        app.globalData.parentRankInfo = wx.getStorageSync('parentRankInfo') || {}
        that.setData({
          parentRankInfo: app.globalData.parentRankInfo
        })
      }
      this.getTeenage(app.globalData.jwt)
      this.checkChild()
      this.getTotalGames(jwt)
      this.getOpponentCount(jwt)
    })
  },
  getNearByUser(jwt) {
    // let that = this
    // http.getReq(`user/nearby?gps=${this.data.userLocation.latitude},${this.data.userLocation.longitude}`, jwt, (e) => {
    //   that.setData({
    //     nearByUser: e.data.filter(u => {
    //       return u.id !== app.globalData.openId
    //     })
    //   })
    // })
  },
  getNearByCourt(jwt) {
    // let that = this
    // http.getReq(`match/court/nearby?gps=${this.data.userLocation.latitude},${this.data.userLocation.longitude}`, jwt, (e) => {
    //   that.setData({
    //     nearByCourt: e.data
    //   })
    // })
  },
  gps() {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          userLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
        wx.setStorageSync('gps', `${res.latitude},${res.longitude}`)
        app.globalData.gps = `${res.latitude},${res.longitude}`
      }
    })

  },
  checkChild() {
    this.setData({
      isShowAppendChild: typeof this.data.userRankInfo.clubId !== 'undefiled' && parseInt(this.data.userRankInfo.clubId) !== 0
    })

  },
  switchMode() {
    this.setData({
      isSingle: !this.data.isSingle
    })
    var ladderComp = this.selectComponent('#ladder');
    if (ladderComp) {
      ladderComp.switchMode(this.data.isSingle)
    }
    var matchComp = this.selectComponent('#match');
    if (matchComp) {
      matchComp.switchMode(this.data.isSingle)
    }
  },
  masterNav(e) {
    if (app.globalData.userRankInfo.clubId === 3 ) {
      wx.navigateTo({
        url: '../../pages/master/player'
      })
    }
  },
  teenageTap(event) {
    if (event.currentTarget.dataset.variable !== -1) {
      // let child = app.globalData.childRankInfo[event.currentTarget.dataset.variable]
      let child = this.data.teenage[event.currentTarget.dataset.variable]
      let user = {
        token: child.id,
        nickName: child.nickName,
        avator: child.avator,
        gps: app.globalData.parentInfo.gps
      }
      this.login(user)
    } else {
      let parent = app.globalData.parentInfo
      let user = {
        token: app.globalData.parentOpenId,
        nickName: parent.nickName,
        avator: parent.avatarUrl,
        gps: parent.gps
      }
      this.login(user)
    }
  },
  navigateTo(event) {
    if (!this.checkingLogin()) {
      this.setData({
        hasUserInfo: false
      })
      return
    }
    if (event.currentTarget.dataset.variable === -1) {
      if (parseInt(this.data.userRankInfo.clubId) !== 1) {
        $Toast({
          content: '请切换到家长账号',
          type: 'warning'
        });
      } else {
        wx.navigateTo({
          url: '../../pages/teenage/create'
        })
      }

    } else
    if (event.currentTarget.dataset.variable === 0) {
      wx.navigateTo({
        url: '../../pages/matches/matchlist'
      })
    } else
    if (event.currentTarget.dataset.variable === 1) {
      wx.navigateTo({
        url: '../../pages/score/score'
      })
    } else
    if (event.currentTarget.dataset.variable === 2) {
      wx.navigateTo({
        url: '../../pages/player/player?rankPosition=' + this.data.rankPosition
      })
    } else
    if (event.currentTarget.dataset.variable === 3) {
      wx.navigateTo({
        url: '../../pages/h2h/h2h?winRate=' + this.data.userRankInfo.winRate
      })
    }
    // event.currentTarget.dataset.variable;
  },
})