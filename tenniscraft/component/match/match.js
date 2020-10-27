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
    },
    isSingle:{
      type: Boolean,
      value: false
    },
    userList:{
      type:Array,
      value:[]
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
  lifetimes: {
    attached() {
      let event = {
        currentTarget: {
          dataset: {
            gid: 0
          }
        }
      }
      this.tapTabStatus(event)
    }
  },


  /**
   * 组件的方法列表
   */
  methods: {
    clearMatches() {
      this.setData({
        matches: []
      })
    },
    closeMap() {
      this.setData({
        showMap: false
      })
    },
    onLocationTapped(e) {
      this.triggerEvent('locationTapped',this.data.matches);
      // this.setData({
      //   latitude: e.detail.courtGPS ? e.detail.courtGPS.split(',')[0] : app.globalData.gps.split(',')[0],
      //   longitude: e.detail.courtGPS ? e.detail.courtGPS.split(',')[1] : app.globalData.gps.split(',')[1],
      //   markers: e.detail.courtGPS ? [{
      //     id: 1,
      //     latitude: e.detail.courtGPS.split(',')[0],
      //     longitude: e.detail.courtGPS.split(',')[1],
      //     name: e.detail.courtName
      //   }] : []
      // });

      // this.setData({
      //   showMap: true
      // })
   
        if (parseInt(this.data.matches.status) == 2002 && this.data.matches.matchType !=3001) {
          return
        }
       
     
    },
     // 上拉加载更多
  loadMore: function(){
    var self = this;
    // 当前页是最后一页
    if (self.data.currentPage == self.data.allPages){
      self.setData({
        loadMoreData: '已经到顶'
      })
      return;
    }
    setTimeout(function(){
      console.log('上拉加载更多');
      // var tempCurrentPage = self.data.currentPage;
      // tempCurrentPage = tempCurrentPage + 1;
      // self.setData({
      //   currentPage: tempCurrentPage,
      //   hideBottom: false  
      // })
      // self.getData();  
    },300);
  },
  // 下拉刷新
  refresh: function(e){
    var self = this;
    setTimeout(function(){
      console.log('下拉刷新');
      // var date = new Date();
      // self.setData({
      //   currentPage: 1,
      //   refreshTime: date.toLocaleTimeString(),
      //   hideHeader: false
      // })
      // self.getData();
    },300);
  },
    tapTabStatus(event) {
      this.setData({
        tabStatus: event.currentTarget.dataset.gid
      })
      if (parseInt(event.currentTarget.dataset.gid) === 2) {
        this.matchedGame()
      } else if (parseInt(event.currentTarget.dataset.gid) === 1) {
        this.matching()
        this.setData({
          matches: []
        })
      } else {
        this.matcheExplore()
      }
    },
    matching() {
      let that = this
      let url= this.data.isSingle?'match/randomMatch':'match/randomDoubleMatch'
      http.postReq(url, app.globalData.jwt, {
        gps: app.globalData.gps
      }, (res) => {
        if (res.code == 0 && res.data != null) {

          wx.showLoading({
            title: 'loading...',
          })
          setTimeout(function () {
            let matchUrl=this.data.isSingle?'match/matchInfo':'match/doubleMatchInfo'
            http.getReq(`${matchUrl}/${res.data}`, app.globalData.jwt, (resMatch) => {
              // console.info(resMatch)
              if (resMatch.code === 0) {
                that.setData({
                  matches: [resMatch.data]
                })

              }
            })
          }, 1000)

        } else if (res.code == 91003) {
          wx.showToast({
            icon: 'none',
            title: res.message,
            duration: 3000
          })

        } else {
          wx.showToast({
            icon: 'none',
            title: '没找到对手，请发布比赛、参加其他选手比赛或者发起挑战',
            duration: 3000
          })
        }
      })
    },
    matchedGame() {
      let that = this
      let url= this.data.isSingle?'match/matchedGames':'match/doubleMatchedGames'
      http.getReq(`${url}/10`, app.globalData.jwt, (res) => {
        if (res.code === 0) {
          console.log(res)
          // that.setData({
          //   matches: [{
          //     "challengerScore":6,"holderScore":4,
          //     "holderrankType0":"白银",
          //     "challengerrankType0":"黄金",
          //     "challengerAvator":"https://thirdwx.qlogo.cn/mmopen/vi_32/VUDUy2iac9PAhMicdfU4FfAlgQT7cSJl5ILnQwiaYQicUibVq7iamKvxwHJ4IkjOm6ShEgeAW4Eu8Soadzl6iajU72M0Q/132","challengerName":"Jerry",
          //   "challengerAvator2":"https://thirdwx.qlogo.cn/mmopen/vi_32/x307v1K8rWibQemibA649icojHU3TBFlxJR9EBr0jjRGYIZYkjZGbUDfwBwTSUTIJEEbf97K9gmV8ickNG7h9nx4Ag/132","challengerName2":"JU4ever",
          //   "holderAvator":"https://thirdwx.qlogo.cn/mmopen/vi_32/EjkFziczku4zYERlfjgpZ6SQU8t03tF0FJuF3j8xNZbX4YlzSlVp2MXbibjQvMPJaV3nWTPB1qiadKTRwTqbhqvhQ/132","holderName":"别吹啊",
          //   "holderAvator2":"https://thirdwx.qlogo.cn/mmopen/vi_32/NFicMFicPicibcUGhPPHsWURhpCG3zptECkm1iazd0A20mLR9YYibnOh6YHScXTxIsoy5gjoHZBqNjh2qXJuTu5oH6CA/132","holderName2":"Michael Zheng"}]
          // })
          that.setData({
            matches:res.data
          })
        }
      })
    },

    matcheExplore() {
      let that = this
      http.getReq('match/intentionalMatch/10', app.globalData.jwt, (res) => {
        if (res.code === 0) {
          that.setData({
            matches: res.data
          })
        }
      })
    },
    createIntentional() {
      let that = this
      wx.navigateTo({
        url: '../../pages/dealing/dealing',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function (data) {},
          someEvent: function (data) {}

        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            data: {
              holderAvator: app.globalData.userInfo.avatarUrl,
              holderName: app.globalData.userInfo.nickName,
              holderrankType0: app.globalData.userRankInfo.rankType0,
              isPlus: true
            }
          })
        }
      })
    },
    switchMode(isSingle){
      this.setData({
        isSingle:isSingle
      } )
      let event = {
        currentTarget: {
          dataset: {
            gid: 0
          }
        }
      }
      this.tapTabStatus(event)
    },
    updateMatchCourt(gps,name){
      let that = this
      let url= `match/doubleMatchInfo/${this.data.matches[0].id}`

      http.postReq(url, app.globalData.jwt, {
        courtGPS: gps,
        courtName:name,
      }, (res) => {
        console.log(res)
        if (res.code == 0 && res.data != null) {
          // wx.showLoading({
          //   title: 'loading...',
          // })
          // setTimeout(function () {
          //   let matchUrl=this.data.isSingle?'match/matchInfo':'match/doubleMatchInfo'
          //   http.getReq(`${matchUrl}/${res.data}`, app.globalData.jwt, (resMatch) => {
          //     // console.info(resMatch)
          //     if (resMatch.code === 0) {
          //       that.setData({
          //         matches: [resMatch.data]
          //       })
          //     }
          //   })
          // }, 1000)

        } 
      })
    }
  }
})