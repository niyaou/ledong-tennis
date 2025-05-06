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
  getOpenId(){
    wx.cloud.callFunction({
      name:"getopenId",
      success(res){
        console.log(res)
      },
      fail(err){
        console.log(err)
      }
    })
  },
  getPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 用户同意授权，获取加密数据和iv
      console.log('==== e.detail=', e.detail)
      const { encryptedData, iv,code } = e.detail;
      // 这里可以调用云函数或后端接口解密手机号
      wx.cloud.callFunction({
        name: 'baseNumber',
        data: {
          encryptedData,
          iv,
          code
        },
        success: res => {
          console.log('resutl',res.result)
          if (res.result && res.result.errCode===0) {
            this.setData({
              phoneNumber: res.result.phoneInfo.phoneNumber
            });
            wx.showToast({
              title: '获取手机号成功',
              icon: 'success'
            });
            console.log('手机号:',  res.result.phoneInfo.phoneNumber);
          } else {
            wx.showToast({
              title: '获取手机号失败',
              icon: 'error'
            });
            console.error('获取手机号失败', res.result ? res.result.error : res);
          }
        },
        fail: err => {
          wx.showToast({
            title: '云函数调用失败',
            icon: 'error'
          });
          console.error('云函数调用失败', err);
        }
      });
    } else {
      // 用户拒绝授权
      wx.showToast({
        title: '您拒绝了授权',
        icon: 'none'
      });
      console.warn('用户拒绝授权手机号');
    }
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
  }

}) 