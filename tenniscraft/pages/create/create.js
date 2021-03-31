// pages/matches/matchlist.js
const app = getApp()
var http = require('../../utils/http.js')
var pinyin = require('../../utils/pinyinUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    players:[],
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
choiceOpponent(e){
  wx.navigateTo({
    url: 'url',
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
    // if (pinyinjs.hasOwnProperty(char)) {
    //   console.log(pinyinjs[char][0].substring(0,1))
    //   this.setData({
    //     pinyinval: pinyinjs[char].join(', ')
    //   });
    // }
    // else {
    //   this.setData({
    //     pinyinval: '找不到，^_^'
    //   });
    // }
 
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
    console.log(pinyin.pinyinUtil)
    let nickName = pinyin.pinyinUtil.getFirstLetter("法国大使馆反对".substring(0,1))
    console.log(nickName)
    let url = 'rank/rankList?count=500'
    http.getReq(`${url}`, app.globalData.jwt, (res) => {
      let storeCity = new Array(26);
      const words = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
      words.forEach((item,index)=>{
          storeCity[index] = {
              key : item,
              list : []
          }
        })
      res.data.forEach((item)=>{
        // let nickName= pinyinjs[item.nickName]
        // if(typeof nickName ==='undefined'){
        //   nickName= pinyinjs["之"]
        // }
        console.log()
        let nickName = pinyin.pinyinUtil.getFirstLetter(item.nickName.substring(0,1))

          let firstName =nickName[0].substring(0,1)  ;
          let index = words.indexOf( firstName.toUpperCase() );
          console.log(firstName,index)
          storeCity[index].list.push({
              name : item.nickName,
              key : firstName
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