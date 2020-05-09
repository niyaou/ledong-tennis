// component/match/match.js
var http = require('../../utils/http.js')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isPicked: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    matching: false,
    arrs: [1],
    showMap: false,
    matches: [],
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    longitude: '',
    latitude: '',
    tabStatus: 0 //栏目选择状态
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeMap() {

      this.setData({
        showMap: false
      })
    },
    onLocationTapped(e) {
      console.info(e)
      this.setData({
        latitude: e.detail.courtGPS ? e.detail.courtGPS.split(',')[0] : app.globalData.gps.split(',')[0],
        longitude: e.detail.courtGPS ? e.detail.courtGPS.split(',')[1] : app.globalData.gps.split(',')[1],
        markers: e.detail.courtGPS ? [{
          id: 1,
          latitude: e.detail.courtGPS.split(',')[0],
          longitude: e.detail.courtGPS.split(',')[1],
          name: e.detail.courtName
        }] : []
      });

      this.setData({
        showMap: true
      })
    },
    tapTabStatus(event) {
  
      this.setData({
        tabStatus: event.currentTarget.dataset.gid
      })
   
      if (parseInt(event.currentTarget.dataset.gid) === 2) {
        console.log(event.currentTarget.dataset.gid)
        this.matchedGame()
      } else if (parseInt(event.currentTarget.dataset.gid) === 1) {
        this.matching()
      } else {
        this.matcheExplore()
      }

    },
    matching() {

      http.postReq('match/randomMatch', app.globalData.jwt, {
        gps: app.globalData.gps
      }, (res) => {
        console.info(res)
      })
    },
    matchedGame() {
      let that = this
      http.getReq('match/matchedGames/10', app.globalData.jwt, (res) => {
        console.info(res)
        if (res.code === 0) {
          that.setData({
            matches: res.data
          })
        }
      })
    },

    matcheExplore() {
      let that = this
      http.getReq('match/intentionalMatch/10', app.globalData.jwt, (res) => {
        console.info(res)
        if (res.code === 0) {
          that.setData({
            matches: res.data
          })
        }
      })
    },
    createIntentional(){
      let that = this
      wx.navigateTo({
        url: '../../pages/dealing/dealing',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function(data) {
            console.log(data)
          },
          someEvent: function(data) {
            console.log(data)
          }
      
        },
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data:{holderAvator:app.globalData.userInfo.avatarUrl,
            holderName:app.globalData.userInfo.nickName,
            holderrankType0:app.globalData.userRankInfo.rankType0,
            isPlus:true
          } })
        }
      })
      console.info('navigateTo',app.globalData.userRankInfo)
    }

  }
})