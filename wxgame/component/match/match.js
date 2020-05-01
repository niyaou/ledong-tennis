// component/match/match.js
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
     matching:false,
     arrs:[1],
     matches:[],
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
      console.info(typeof event.currentTarget.dataset.gid,event.currentTarget.dataset.gid)
      if( parseInt(event.currentTarget.dataset.gid) === 2){
        console.log(event.currentTarget.dataset.gid)
        this.matchedGame()
      }
  
    },
    matching(){
   
      http.postReq('match/randomMatch',app.globalData.jwt,{gps:app.globalData.gps},(res)=>{
        console.info(res)
      })
    },
    matchedGame(){
let that = this
      http.getReq('match/matchedGames/10',app.globalData.jwt,(res)=>{
        console.info(res)
        if(res.code === 0 ){
          that.setData({matches:res.data})
        }
   
      })
    }
  }
})
