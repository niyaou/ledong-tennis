var http = require('../../utils/http.js')
const app = getApp()
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
    arrs:[1,2,3,4,1,2,1,1,1,1,1,1,1,1,11,1,1,1,11,1,1,1,1,1,1,1,1,11,],
    tabStatus:'', //栏目选择状态,
    players:[]
  },
lifetimes:{
  attached(){
    let that = this
    http.getReq(`rank/rankList`,app.globalData.jwt, (res)=>{
      console.info(res)
      that.setData({
        players:res.data}
      )
    })
  }
},
  /**
   * 组件的方法列表
   */
  methods: {
    tapTabStatus(event){
      let that = this
      http.getReq(`rank/rankList?grade=${event.currentTarget.dataset.gid}`,app.globalData.jwt, (res)=>{
        console.info(res)
        that.setData({
          players:res.data,
          tabStatus:event.currentTarget.dataset.gid
        }
        )
      })
    }
  
  }
})
