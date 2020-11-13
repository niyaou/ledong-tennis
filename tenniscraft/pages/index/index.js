//index.js
//获取应用实例
const app = getApp()
var http = require('../../utils/http.js')
const chooseLocation = requirePlugin('chooseLocation');
Page({
  data: {
    motto: 'Hello World',
    userInfo: {nickName:"请登录",avatarUrl:"../../icon/user2.png"},
    userLocation: {},
    userRankInfo: {rankType0:'暂无'},
    vsCode: '',
    nearByUser: [],
    rankPosition: 0,
    nearByCourt: [],
    isSingle:true,
    hasInitial:false,
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    ratio: getApp().globalData.ratio,
    tabBarStatus: 1, // 栏目标志位 0:技术统计， 1：比赛 ， 2：天梯,
    userList:[]
  },
  //事件处理函数
  bindViewTap: function () {
    if(this.data.hasInitial){
      return
    }
    this.setData({hasUserInfo:false})
    return 
  },
  onLoad: function () {
    let that = this
    if (app.globalData.jwt) {
      this.getUserInfoByJwt(app.globalData.jwt)
      this.getUserRankInfo(app.globalData.jwt)
      this.getRankPosition(app.globalData.jwt)
      this.gps()
    }

    http.getReq(`user/userList`, app.globalData.jwt, (res) => {
  
      if (res.code == 0 && res.data != null) {
        // console.log('userlist',res.data)
        app.globalData.userList=res.data
        that.setData({
          userList:res.data
        })
      }
      // console.log('set app data user list',app.globalData.userList)
  })

  },
  onShow: function () {
    let that = this
    if (!this.data.hasInitial) {
      return
    }
    http.getReq(`match/matchResult`, app.globalData.jwt, (res) => {
      if (res.code == 0 && res.data != null) {
        let message = (app.globalData.openId == res.data.holder) ? (res.data.winner == 5000 ? '比赛胜利' : '比赛失败') :
          (res.data.winner == 5001 ? '比赛胜利' : '比赛失败')
        let other = (app.globalData.openId !== res.data.holder) ? res.data.holderName : res.data.challengerName
        let title = `你与${other}的${message}`
        wx.showModal({
          title: '比赛结果',
          content: title
        })
      }
    })


    var matchComp = this.selectComponent('#match');
    if (matchComp != null && matchComp.data.tabStatus != 1) {
      matchComp.tapTabStatus({
        currentTarget: {
          dataset: {
            gid: matchComp.data.tabStatus
          }
        }
      })
    }
    if (matchComp != null && matchComp.data.tabStatus == 1){
      matchComp. clearMatches()
    }

    const location = chooseLocation.getLocation();
    if (location) {
      console.log('-----------1',location)
      var matchComp = this.selectComponent('#match');
      if(matchComp && !this.data.isSingle){
        matchComp.updateMatchCourt(`${location.latitude},${location.longitude}`,location.name)
      }

      chooseLocation.setLocation();
      }
   
  },
  onConfirmEmitted(){
    console.log('-----onConfirmEmitted------')
  },
  onLocationTapped(e){
    console.log(e)
    const key = 'YIGBZ-BKCRF-JI5JV-NZ6JF-A5ANT-LSF2T'; //使用在腾讯位置服务申请的key
    const referer = 'dd'; //调用插件的app的名称

    const location = JSON.stringify({
      latitude: e.detail[0].courtGPS ? e.detail[0].courtGPS.split(',')[0] : app.globalData.gps.split(',')[0],
      longitude: e.detail[0].courtGPS ?e.detail[0].courtGPS.split(',')[1] : app.globalData.gps.split(',')[1],
    });
    const category = '体育户外,体育场馆,';
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`,
      success: function(res) {
        console.log(res)
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: res})
      }
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
    })
    this.verified()
  },
  verified() {
    let that = this
    wx.login({
      success(res) {
        http.postReq('user/verified', '', {
          token: res.code,
        }, function (e) {
          that.setData({
            vsCode: e.data
          })
        })
      }
    })
  },
  login() {
    let that = this
      http.postReq('user/login', '', {
        token:  that.data.openId,
        nickName: that.data.userInfo.nickName,
        avator: that.data.userInfo.avatarUrl,
        gps: `${that.data.userLocation.latitude},${that.data.userLocation.longitude}`
      }, function (e) {
        wx.setStorageSync('jwt', e.data)
        if (e.code == 0) {
          app.globalData.jwt = e.data
          setTimeout(function () {
            that.gps()
            that.getUserInfoByJwt(e.data)
            that.getUserRankInfo(e.data)
            that.getNearByCourt(app.globalData.jwt)
            that. getNearByUser(app.globalData.jwt)
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
      let jsonData=JSON.parse(e.data)
      if (e.code == 0) {
        that.setData({
          openId:jsonData.purePhoneNumber,
        })
        that.login()
      }
    })
  },
  getUserInfoByJwt(jwt) {
    http.getReq('user/userinfo', jwt, (e) => {
      this.setData({
        userInfo: {
          avatarUrl: e.data.avator,
          nickName: e.data.nickName
        },
        hasUserInfo: true,
        hasInitial:true
      })
    })
  },
  getRankPosition(jwt) {
    http.getReq('rank/rankPosition', jwt, (e) => {
      this.setData({
        rankPosition: e.data
      })
    })
  },
  getUserRankInfo(jwt) {
    http.getReq('rank/rankInfo', jwt, (e) => {
      this.setData({
        userRankInfo: {
          rankType1: e.data.rankType1,
          rankType0: e.data.rankType0,
          doubleRankType1: e.data.doubleRankType1,
          doubleRankType0: e.data.doubleRankType0,
          winRate: e.data.winRate,
          score:e.data.score,
          doubleRankPosition:e.data.doublePosition,
          doubleWinRate:e.data.doubleWinRate,
          doubleScore:e.data.doubleScore
        }
      })
      app.globalData.userRankInfo = this.data.userRankInfo
      app.globalData.openId = e.data.openId
    })
  },
  getNearByUser(jwt) {
    let that = this
    http.getReq(`user/nearby?gps=${this.data.userLocation.latitude},${this.data.userLocation.longitude}`, jwt, (e) => {
      that.setData({
        nearByUser: e.data.filter(u => {
          return u.id !== app.globalData.openId
        })
      })
    })
  },
  getNearByCourt(jwt) {
    let that = this
    http.getReq(`match/court/nearby?gps=${this.data.userLocation.latitude},${this.data.userLocation.longitude}`, jwt, (e) => {
      that.setData({
        nearByCourt: e.data
      })
    })
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
  tabStatus(event) {
    if(!this.data.hasInitial && event.currentTarget.dataset.gid != 2 ){
      this.setData({hasUserInfo:false})
      return
    }



    this.setData({
      tabBarStatus: event.currentTarget.dataset.gid
    })
    if (event.currentTarget.dataset.gid == 0) {
      this.getUserRankInfo(app.globalData.jwt)
      this.getRankPosition(app.globalData.jwt)
      this.getNearByCourt(app.globalData.jwt)
      this. getNearByUser(app.globalData.jwt)
    }
  },
  masterTap(){
    if(app.globalData.openId == '19960390361' || app.globalData.openId == '18602862619' ){
    
      wx.navigateTo({
        url: '../master/master' 
      })
    }else{
    }
  },
  switchMode(){
    this.setData({
      isSingle:!this.data.isSingle
    })
    var ladderComp = this.selectComponent('#ladder');
    if(ladderComp){
      ladderComp.switchMode(this.data.isSingle)
    }
    var matchComp = this.selectComponent('#match');
    if(matchComp){
      matchComp.switchMode(this.data.isSingle)
    }
  }
})