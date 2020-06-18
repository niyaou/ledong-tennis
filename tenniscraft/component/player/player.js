var http = require('../../utils/http.js')
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
    holder:{
      type: String,
      value:''
    },
    holderName: {
      type: String,
      value: '守护者'
    },
    winRate:{
      type:Number,
      value:0
    },
    rankType0:{
      type:String,
      value:''
    },
    courtName:{
      type:String,
      value:''
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    //  winrate:app.globalData.userRankInfo.winRate
  },

  /**
   * 组件的方法列表
   */
  methods: {
    detail(e){
      let that = this
      if(app.globalData.openId !== this.data.holder){
      wx.showModal({
        content:'是否发起挑战',
        success:(res)=>{
          if (res.confirm) {
            // console.log('用户点击确定')
            http.postReq(`match/challengeMatch/${that.data.holder}`, app.globalData.jwt, {} ,(res)=>{
              if(res.code!==0){
                wx.showToast({
                  title: res.message,
                  icon:'none',
                  duration:1500
                })
              }
            })
          } else if (res.cancel) {
      
          }

        }
      })
    }
    }
  }
})
