// pages/matches/matchlist.js
const app = getApp()
var http = require('../../utils/http.js')
var util = require('../../utils/util.js')
var pinyin = require('../../utils/pinyinUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHolder:true,
    holderScore:0,
    challengerScore:0,
    isChoiceOpponent:false,
    players:[],
    time:util.formatTime(new Date()),
    holderName:'',
    holderId:'',
    name:'',
    id:'',
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
  hsChange(e){
    console.log(e)
    this.setData({
      holderScore: parseInt(e.detail.detail.value)
    })
  },
  csChange(e){
   
    console.log(e)
    this.setData({
      challengerScore: parseInt(e.detail.detail.value)
    })
  },
  onChange(e){
    console.log(e)

if(this.data.isHolder){
  this.setData({
    isChoiceOpponent:false,
    holderName:e.currentTarget.dataset.id.name,
    holderId: e.currentTarget.dataset.id.openId
  })
}else{
  this.setData({
    isChoiceOpponent:false,
      name:e.currentTarget.dataset.id.name,
      id: e.currentTarget.dataset.id.openId
  })
}


  },
  handleClick(e){
    let url = 'match/postMatchByMaster'
    http.postReq(`${url}`, app.globalData.jwt, {holder:this.data.holderId,opponent:this.data.id}, (res) => {
      console.log(res)
      if (res.code === 0) {
        wx.showLoading({
          mask:true,
          title: '加载中',
        })
        setTimeout(()=>{
          this. finishMatch(res.data)
        },2000)
      }

      // console.log(res)
    })
  },
  finishMatch(matchId){
    let url = 'match/matchResult/'+matchId
    console.log('finishMatch', {holderScore:this.data.holderScore,challengerScore:this.data.challengerScore})
    http.postReq(`${url}`, app.globalData.jwt, {holderScore:this.data.holderScore,challengerScore:this.data.challengerScore}, (res) => {
      console.log(res)
      wx.hideLoading();
      if (res.code === 0) {
        wx.navigateBack({
          delta: 0,
        })
      }

      // console.log(res)
    })
  },
  handleFruitChange({ detail = {} }) {
    this.setData({
        current: detail.value
    });
},
choiceHolder(e){
  this.setData({
    isHolder:true,
    isChoiceOpponent:true
  })
},
choiceOpponent(e){
this.setData({
  isHolder:false,
  isChoiceOpponent:true
})
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
    // this.pinyin();
  },
  pinyin:function(){
    var char = "使";
 
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
    // console.log(pinyin.pinyinUtil)
    // let nickName = pinyin.pinyinUtil.getFirstLetter("法国大使馆反对".substring(0,1))
    // console.log(nickName)
    let url = 'rank/rankList?count=500'
    http.getReq(`${url}`, app.globalData.jwt, (res) => {

      let storeCity = new Array(26);
      const words = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","#"]
      words.forEach((item,index)=>{
          storeCity[index] = {
              key : item,
              list : []
          }
        })
      res.data.forEach((item)=>{
        let nickName = pinyin.pinyinUtil.getFirstLetter(item.nickName.substring(0,1))
        // console.log('item.nickName',item.nickName,'nickName',nickName)
        let firstName ='#'
        let index=words.length-1
          firstName =nickName[0].substring(0,1)  ;
          index = words.indexOf( firstName.toUpperCase() );
          if(index===-1){
            index=words.length-1
            firstName ='#'
          }
          // console.log('firstName',firstName,'index',index)
          storeCity[index].list.push({
              name : item.nickName,
              key : firstName,
              openId:item.openId
          });
      })
      this.data.players = storeCity;
      this.setData({
          players : this.data.players
      })
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
  onShareAppMessage: function () {

  }
})