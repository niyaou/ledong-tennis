Page({
  data: {
    userInfo: {
      nickName: '',
      avatarUrl: '',
      memberLevel: '',
      memberCardNo: '',
      points: 0,
      expireDate: ''
    },
    showAddCourtModal: false,
    campus: '',
    courtNumber: ''
  },

  onLoad: function() {
    // 检查本地存储中是否有用户信息
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ userInfo });
    }
  },

  getUserProfile: function() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        const userInfo = res.userInfo;
        // 这里可以添加注册会员的逻辑
        this.setData({ userInfo });
        wx.setStorageSync('userInfo', userInfo);
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
      }
    });
  },

  navigateToMyBookings: function() {
    wx.navigateTo({
      url: '/pages/my-bookings/my-bookings'
    });
  },

  navigateToPoints: function() {
    wx.navigateTo({
      url: '/pages/points/points'
    });
  },

  navigateToSettings: function() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  showAddCourtModal: function() {
    this.setData({ showAddCourtModal: true });
  },

  handleModalCancel: function() {
    this.setData({ showAddCourtModal: false, campus: '', courtNumber: '' });
  },

  onCampusInput: function(e) {
    this.setData({ campus: e.detail.value });
  },

  onCourtNumberInput: function(e) {
    this.setData({ courtNumber: e.detail.value });
  },

  handleModalConfirm: function() {
    const { campus, courtNumber } = this.data;
    if (!campus || !courtNumber) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    wx.cloud.callFunction({
      name: 'add_court',
      data: { campus, courtNumber },
      success: (res) => {
        if (res.result && res.result.success) {
          wx.showToast({ title: '添加成功', icon: 'success' });
          this.setData({ showAddCourtModal: false, campus: '', courtNumber: '' });
        } else {
          wx.showToast({ title: res.result.error || '添加失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  }
}); 