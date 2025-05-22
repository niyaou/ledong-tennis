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
    newsList: []
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.getAnnouncements()
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

  getAnnouncements() {
    wx.cloud.callFunction({
      name: 'announcement',
      success: res => {
        this.setData({
          newsList: res.result.data
        })
      },
      fail: err => {
        console.error('获取公告失败：', err)
        wx.showToast({
          title: '获取公告失败',
          icon: 'none'
        })
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