// index.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    phoneNumber: '',
    banners: [
      { id: 1, title: '欢迎使用乐动网球' },
      { id: 2, title: '新会员优惠活动' },
      { id: 3, title: '场地预约优惠' }
    ],
    newsList: [
      { id: 1, title: '网球场地维护通知', date: '2024-05-01' },
      { id: 2, title: '新会员优惠活动', date: '2024-04-28' },
      { id: 3, title: '网球培训课程更新', date: '2024-04-25' }
    ]
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  qiuhe(){
    wx.cloud.callFunction({
      name:"add",
      data:{
        a:1,
        b:3
      },
      success(res){
        console.log(res)
      },
      fail(err){
        console.log(err)
      }
    })
  },


  navigateToBooking: function() {
    wx.switchTab({
      url: '/pages/booking/booking'
    });
  },
  navigateToMember: function() {
    wx.switchTab({
      url: '/pages/member/member'
    });
  },

  // 生成随机字符串
  generateNonceStr() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 32;
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },


}) 