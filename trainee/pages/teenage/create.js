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
    tempSrc: '',
    src: '',
    teenageId: '',
    isAppending: false,
    loaded: false,
    isHolder: true,
    holderScore: 0,
    challengerScore: 0,
    isChoiceOpponent: false,
    players: [],
    time: util.formatTime(new Date()),
    holderName: '',
    holderId: '',
    name: '',
    id: '',
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
    slideButtons: [],
  },
  hsChange(e) {
    console.log(e)
    this.setData({
      holderScore: parseInt(e.detail.detail.value)
    })
  },
  csChange(e) {

    console.log(e)
    this.setData({
      challengerScore: parseInt(e.detail.detail.value)
    })
  },
  onChange(e) {
    console.log(e)
    this.setData({
      holderName: e.detail.detail.value
    })

  },
  uploadAvator(e) {
    console.log('e', e)
    let that = this
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        let url = http.rootDocment + 'user/ld/teenage/avator'
        var header = {
          'Accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + app.globalData.jwt
        }
        wx.uploadFile({
          url: url, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: header,
          formData: {},
          success(res) {
            const data = res.data
            console.log(data)
            let response = JSON.parse(data)
            console.log(response)
            let src = http.rootDocment + "teenage/" + response.data
            console.log(src)

            that.setData({
              src: src,
              loaded: true
            })
          }
        })
      }
    })
  },
  handleClick(e) {
    if (this.data.src === '') {
      wx.showToast({
        title: '请上传头像',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.holderName === '') {
      wx.showToast({
        title: '请输入小学员名字',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      teenageId: this.data.holderName,
      tempSrc: this.data.src
    })
    let url = 'user/ld/exploreTeenage'
    http.getReq(`${url}`, app.globalData.jwt, (res) => {
      console.log(res)
      wx.hideLoading();
      if (res.code === 0) {
        if (res.data !== null && res.data.length > 0) {
          let current = res.data.filter(r => {
            return r.nickName === this.data.holderName
          })
          if (current.length > 0) {
            this.setData({
              isAppending: true,
              src: current[0].avator,
              teenageId: current[0].openId
            })
          } else {
            wx.showLoading({
              mask: true,
              title: '加载中',
            })
            setTimeout(() => {
              this.finishMatch({
                currentTarget: {
                  dataset: {
                    variable: true
                  }
                }
              })
            }, 1000)
          }
        } else {
          wx.showLoading({
            mask: true,
            title: '加载中',
          })
          setTimeout(() => {
            this.finishMatch({
              currentTarget: {
                dataset: {
                  variable: true
                }
              }
            })
          }, 1000)
        }
      }
    })
  },
  finishMatch(e) {
    let needReName = e.currentTarget.dataset.variable
    let url = needReName ? 'user/ld/createTeenage' : 'user/ld/updateTeenageParent'
    let src = needReName ? this.data.tempSrc : this.data.src
    http.postReq(`${url}`, app.globalData.jwt, {
      openId: needReName ? (this.data.teenageId + '1') : this.data.teenageId,
      name: this.data.holderName,
      avator: src
    }, (res) => {
      console.log(res)
      if (res.code === 0) {
        wx.showLoading({
          mask: true,
          title: '加载中',
        })
        setTimeout(() => {
          wx.hideLoading();
          wx.navigateBack({
            delta: 0,
          })
        }, 2000)
      } else {
        wx.showToast({
          title: '添加失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  handleFruitChange({
    detail = {}
  }) {
    this.setData({
      current: detail.value
    });
  },
  choiceHolder(e) {
    this.setData({
      isHolder: true,
      isChoiceOpponent: true
    })
  },
  choiceOpponent(e) {
    this.setData({
      isHolder: false,
      isChoiceOpponent: true
    })
  },
  handleTapped(e) {

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
  pinyin: function () {
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

    this.setData({
      isAppending: false,
      teenageId: ''
    })

    // let url = 'rank/rankList?count=500'
    // http.getReq(`${url}`, app.globalData.jwt, (res) => {

    //   let storeCity = new Array(26);
    //   const words = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"]
    //   words.forEach((item, index) => {
    //     storeCity[index] = {
    //       key: item,
    //       list: []
    //     }
    //   })
    //   res.data.forEach((item) => {
    //     let nickName = pinyin.pinyinUtil.getFirstLetter(item.nickName.substring(0, 1))
    //     // console.log('item.nickName',item.nickName,'nickName',nickName)
    //     let firstName = '#'
    //     let index = words.length - 1
    //     firstName = nickName[0].substring(0, 1);
    //     index = words.indexOf(firstName.toUpperCase());
    //     if (index === -1) {
    //       index = words.length - 1
    //       firstName = '#'
    //     }
    //     // console.log('firstName',firstName,'index',index)
    //     storeCity[index].list.push({
    //       name: item.nickName,
    //       key: firstName,
    //       openId: item.openId
    //     });
    //   })
    //   this.data.players = storeCity;
    //   this.setData({
    //     players: this.data.players
    //   })
    // })


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