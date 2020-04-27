// component/nearplayer/nearplayer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    holderAvator: {
      type: String,
      value: '../../icon/tenniscourt.jpg'
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
    rankType:{
      type:Number,
      value:1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
arrs:[1,2,34,5,6,1]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
