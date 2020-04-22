// component/ladder/ladder.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isPicked:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabStatus:0 //栏目选择状态
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapTabStatus(event){
      this.setData({
        tabStatus:event.currentTarget.dataset.gid
      })
      console.log(event.currentTarget.dataset.gid)
    }
  
  }
})
