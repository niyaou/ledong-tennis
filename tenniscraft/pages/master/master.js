const app = getApp()
var http = require('../../utils/http.js')
const chooseLocation = requirePlugin('chooseLocation');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    totalBarHeight: getApp().globalData.totalBarHeight,
    isUserList: true,
    matches: {
      holderAvator: '../../icon/quest.png',
      challengerAvator: '../../icon/quest.png'
    },
    players: [],
    userList: [],
    matchList: [],
    scoreList: [0, 1, 2, 3, 4, 5, 6, 7],
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

    const location = chooseLocation.getLocation();
    if (location) {
      this.setData({
        matches: Object.assign(this.data.matches, {
          courtName: location.name,
          courtGPS: `${location.latitude},${location.longitude}`
        })
      })
      chooseLocation.setLocation();
    }
  },

  bindScoreChange1: function (e) {
    console.info(e)
    let that = this
    let pickerValue = e.detail.value
    let listIndex = e.currentTarget.dataset.index
    this.data.matchList[listIndex].holderScore = pickerValue

    http.postReq(`match/matchScore/${this.data.matchList[listIndex].id}`, app.globalData.jwt, {
      holderScore: that.data.matchList[listIndex].holderScore,
    }, (res) => {
      if (res.code !== 0) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500
        })
      } else {
        that.setData({
          matchList: that.data.matchList
        })

      }
    })
  },
  bindScoreChange2: function (e) {
    console.info(e)
    let that = this
    let pickerValue = e.detail.value
    let listIndex = e.currentTarget.dataset.index
    this.data.matchList[listIndex].challengerScore = pickerValue
    http.postReq(`match/matchScore/${this.data.matchList[listIndex].id}`, app.globalData.jwt, {
      challengerScore: that.data.matchList[listIndex].challengerScore,
    }, (res) => {
      if (res.code !== 0) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500
        })
      } else {
        that.setData({
          matchList: that.data.matchList
        })

      }
    })




  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.matches.holderName = this.data.userList[e.detail.value].nickName
    this.data.matches.holderAvator = this.data.userList[e.detail.value].avator
    this.data.matches.holder = this.data.userList[e.detail.value].openId
    this.setData({
      matches: this.data.matches
    })
  },
  bindPickerChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.matches.challengerName = this.data.userList[e.detail.value].nickName
    this.data.matches.challengerAvator = this.data.userList[e.detail.value].avator
    this.data.matches.challenger = this.data.userList[e.detail.value].openId
    this.setData({
      matches: this.data.matches
    })
  },
  tapCourtLocation() {
    // console.info('pluginsTap   passed')
    const key = 'YIGBZ-BKCRF-JI5JV-NZ6JF-A5ANT-LSF2T'; //使用在腾讯位置服务申请的key
    const referer = 'dd'; //调用插件的app的名称

    const location = JSON.stringify({
      latitude: this.data.matches.courtGPS ? this.data.matches.courtGPS.split(',')[0] : app.globalData.gps.split(',')[0],
      longitude: this.data.matches.courtGPS ? this.data.matches.courtGPS.split(',')[1] : app.globalData.gps.split(',')[1],
    });
    const category = '体育户外,体育场馆,';
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`
    });
  },
  refreshUser() {
    let that = this
    http.getReq(`rank/rankNewList?count=${this.data.count}`, app.globalData.jwt, (res) => {
      that.setData({
        players: res.data
      })
    })
  },
  rank() {
    this.setData({
      isUserList: true
    })
  },
  match() {
    this.setData({
      isUserList: false
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
  confirmMatch(e) {
    console.info(e)

    let listIndex = e.currentTarget.dataset.index

    let that = this
    if (typeof that.data.matchList[listIndex].holderScore == 'undefined' || typeof that.data.matchList[listIndex].challengerScore == 'undefined' ||
      that.data.matchList[listIndex].holderScore == that.data.matchList[listIndex].challengerScore
    ) {
      return
    }

    wx.showModal({
      content: `是否完成${that.data.matchList[listIndex].holderName}与${that.data.matchList[listIndex].challengerName}比赛`,
      success: (res) => {
        console.info('---------------------')
        if (res.confirm) {
          http.postReq(`match/matchResult/${that.data.matchList[listIndex].id}`, app.globalData.jwt, {
            challengerScore: that.data.matchList[listIndex].challengerScore,
            holderScore: that.data.matchList[listIndex].holderScore
          }, (res) => {
            if (res.code !== 0) {
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
              })
            } else {

              that.getMatchList()
            }
          })
        }

      }
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
      complete: (res) => { },
    })
  },
  addMatches(e) {

    let that = this
    if (typeof that.data.matches.holderName == 'undefined' || typeof that.data.matches.challengerName == 'undefined' ||
      typeof that.data.matches.courtGPS == 'undefined' || typeof that.data.matches.courtName == 'undefined' ||
      that.data.matches.holderName == that.data.matches.challengerName) {
      return
    }

    wx.showModal({
      content: `是否添加${that.data.matches.holderName}与${that.data.matches.challengerName}比赛`,
      success: (res) => {
        console.info('---------------------')
        if (res.confirm) {
          http.postReq(`match/postSlamMatchByMaster`, app.globalData.jwt, {
            holder: that.data.matches.holder,
            challenger: that.data.matches.challenger,
            courtName: that.data.matches.courtName,
            courtGPS: that.data.matches.courtGPS,
          }, (res) => {
            if (res.code !== 0) {
              wx.showToast({
                title: res.message,
                icon: 'none',
                duration: 1500
              })
            } else {

              that.setData({
                matches: {
                  holderAvator: '../../icon/quest.png',
                  challengerAvator: '../../icon/quest.png'
                }
              })
            }
          })
        }

      }
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