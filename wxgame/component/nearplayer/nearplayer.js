// component/nearplayer/nearplayer.js
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
    holderName: {
      type: String,
      value: '范大将军c'
    },
    challengerAvator: {
      type: String,
      value: '../../icon/quest.png'
    },
    challengerName: {
      type: String,
      value: '挑战者'
    },
    rankType: {
      type: Number,
      value: 1
    },
    nearBy: {
      type: Array,
      value: []

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    arrs: [1, 2, 34, 5, 6, 1]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    userTap(event) {
      let that = this
      http.getReq(`rank/rankInfo/${event.currentTarget.dataset.item.openId}`, app.globalData.jwt, (res) => {
        that.triggerEvent('nearPlayer', Object.assign(res.data,{avator:event.currentTarget.dataset.item.avator,nickName:event.currentTarget.dataset.item.nickName}))
      })

    }

  }
})