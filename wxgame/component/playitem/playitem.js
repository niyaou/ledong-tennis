// component/playitem/playitem.js
const app = getApp()
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
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
    // this.setData({
    //   holderAvator: app.globalData.userInfo.avatarUrl,
    //   holderName: app.globalData.userInfo.avatarUrl,
    // })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
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
    detail(){
      let that = this
      wx.navigateTo({
        url: '../../pages/dealing/dealing',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function(data) {
          },
          someEvent: function(data) {
          }
      
        },
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: that.data.matches })
        }
      })
    }
  }
})