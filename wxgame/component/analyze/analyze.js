// component/analyze/analyze.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isPicked: {
      type: Boolean,
      value: false
    },
    nearByCourt: {
      type: Array,
      value: []
    },
    nearByUser: {
      type: Array,
      value: []
    },
    winRate:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})