// component/playitem/playitem.js
const app = getApp()
var http = require('../../utils/http.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    holderAvator: {
      type: String,
      value: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epUY765qAmPLVQAyMV2bicsbDQTQD12gm3qa5cuVzdcO4GkHXZuJLBYExoaEHpHBFwTDiauuY9NicpwQ/132'
    },
    holderName: {
      type: String,
      value: '守护者'
    },
    challengerAvator: {
      type: String,
      value: '../../icon/quest.png'
    },
    challengerName: {
      type: String,
      value: '挑战者'
    },
    matches:{
      type:Object,
      value:{}
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
    indexHolderScore:0,
    indexChallengerScore:0,
    scoreArray:[0,1,2,3,4,5,6,7],
    indexHolder:-1,
    indexChallenger:-1,
    userListName:[],
    markers: [{
      iconPath: "../../icon/dimand.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }, {
      iconPath: "../../icon/dimand.png",
      id: 0,
      latitude: 23.079994,
      longitude: 113.374520,
      width: 50,
      height: 50
    }],
    gps: {
      ln: 113.324520,
      lat: 23.099994
    }
  },
  ready() {
    // console.log('double userlist ',this.data.userList)
    this.setData({
      userListName:this.data.userList.map(i=>i.nickName)
    })
    // this.setData({
    //   holderAvator: app.globalData.userInfo.avatarUrl,
    //   holderName: app.globalData.userInfo.avatarUrl,
    // })
  },
  /**
   * 组件的方法列表
   */
  methods: {
  updateMatchPlayer(id,player,side){
    let that = this
   let data=side===0?{holder2:player}:{challenger2:player}
    http.postReq(`match/doubleMatchInfo/${id}`, app.globalData.jwt, data, (res) => {
      if (res.code !== 0) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500
        })
        // that.setData({
        //   matchList: that.data.matchList
        // })
      }
    })
  },
  updateMatchScore(id,holderScore,challengerScore){
    let that = this
   let data={}
   if(holderScore){
    data.holderScore=holderScore
   }
   if(challengerScore){
    data.challengerScore=challengerScore
   }

    http.postReq(`match/doubleMatchScore/${id}`, app.globalData.jwt, data, (res) => {
      if (res.code !== 0) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500
        })
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 1500
        })
        // that.setData({
        //   matchList: that.data.matchList
        // })
      }
    })
  },
  bindChallengerScoreChange(e){
    console.info(e)
  let that = this
  let pickerValue = e.detail.value
  let listIndex = e.currentTarget.dataset.gid
  let matchId = e.currentTarget.dataset.matchid
  console.log('match id ',listIndex,matchId)
  this.setData({
    indexChallengerScore:pickerValue
  })
  // this.updateMatchPlayer(matchId,this.data.userList[pickerValue].id,1)
  this.updateMatchScore(matchId,null,this.data.scoreArray[pickerValue])
  },
  bindHolderScoreChange(e){
    console.info(e)
  let that = this
  let pickerValue = e.detail.value
  let listIndex = e.currentTarget.dataset.gid
  let matchId = e.currentTarget.dataset.matchid
  console.log('match id ',listIndex,matchId)
  this.setData({
    indexHolderScore:pickerValue
  })
  // this.updateMatchPlayer(matchId,this.data.userList[pickerValue].id,1)
  this.updateMatchScore(matchId,this.data.scoreArray[pickerValue],null)
  },

    bindChallengerChange(e){
      console.info(e)
    let that = this
    let pickerValue = e.detail.value
    let listIndex = e.currentTarget.dataset.gid
    let matchId = e.currentTarget.dataset.matchid
    console.log('match id ',listIndex,matchId)
    this.setData({
      indexChallenger:pickerValue
    })
    this.updateMatchPlayer(matchId,this.data.userList[pickerValue].id,1)
    },
    bindHolderChange(e){
      console.info(e)
    let that = this
    let pickerValue = e.detail.value
    let listIndex = e.currentTarget.dataset.gid
    let matchId = e.currentTarget.dataset.matchid
    console.log('match id ',listIndex,matchId)
    this.updateMatchPlayer(matchId,this.data.userList[pickerValue].id,0)
    this.setData({
      indexHolder:pickerValue
    })
    },

    tapCourtLocation(){
      this.triggerEvent('locationTapped',this.data.matches);
    },
    
    switch1() {
      this.setData({
        gps: {
          ln: 113.424520,
          lat: 23.199994
        }
      })
    },
    detail(e){
      let that = this
      console.log(e.currentTarget.dataset.gid)
    },
    onconfirm(e){
      let that = this
      let matches=e.currentTarget.dataset.gid
      console.log(e.currentTarget.dataset.gid,app.globalData.openId,types)
      // let types= (matches.challenger.indexOf(app.globalData.openId)>-1 ||matches.challenger2.indexOf(app.globalData.openId)>-1)?1:0
      let types= 0
      http.postReq(`match/doubleMatchConfirm/${matches.id}/${types}`, app.globalData.jwt, {}, (res) => {
        if (res.code !== 0) {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          })
          // that.setData({
          //   matchList: that.data.matchList
          // })
          
        }
        this.triggerEvent('confirmEmitted');
      })
    }
  }
})