// pages/myOrder/orderlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    phoneNumber: '',
    pageNum: 1,
    pageSize: 10,
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    const phoneNumber = wx.getStorageSync('phoneNumber') || '';
    this.setData({ phoneNumber }, () => {
      this.loadOrders();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    const app = getApp();
    app.globalData.eventBus.emit('refreshBookingPage');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      orderList: [],
      pageNum: 1,
      hasMore: true
    }, () => {
      this.loadOrders();
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.hasMore) {
      this.setData({
        pageNum: this.data.pageNum + 1
      }, () => {
        this.loadOrders();
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  loadOrders: function() {
    const { phoneNumber, pageNum, pageSize } = this.data;
    wx.cloud.callFunction({
      name: 'my_order_list',
      data: {
        phoneNumber,
        pageNum,
        pageSize
      }
    }).then(res => {
      const newOrders = res.result.data || [];
      this.setData({
        orderList: pageNum === 1 ? newOrders : [...this.data.orderList, ...newOrders],
        hasMore: newOrders.length === pageSize
      });
    }).catch(err => {
      console.error('加载订单失败', err);
    });
  },

  formatTime: function(dateString) {
    const date = new Date(dateString);
    console.log(date,dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  prevPage: function() {
    if (this.data.pageNum > 1) {
      this.setData({
        pageNum: this.data.pageNum - 1
      }, () => {
        this.loadOrders();
      });
    }
  },

  nextPage: function() {
    if (this.data.hasMore) {
      this.setData({
        pageNum: this.data.pageNum + 1
      }, () => {
        this.loadOrders();
      });
    }
  },

  onOrderItemClick: function(e) {
    const order = e.currentTarget.dataset.order;
    console.log('订单详情:', order);
  },

  onPayClick: function(e) {
    const order = e.currentTarget.dataset.order;
    if (order.payment_parmas) {
      wx.requestPayment({
        ...order.payment_parmas,
        success: (res) => {
          console.log('支付成功', res);
          // 支付成功后刷新订单列表
          this.onPullDownRefresh();
        },
        fail: (err) => {
          console.error('支付失败', err);
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          });
        }
      });
    }
  },

  onCancelClick: function(e) {
    const order = e.currentTarget.dataset.order;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'cancel_order',
            data: {
              order
            }
          }).then(() => {
            wx.showToast({
              title: '取消成功',
              icon: 'success'
            });
            this.onPullDownRefresh();
          }).catch(err => {
            console.error('取消订单失败', err);
            wx.showToast({
              title: '取消失败',
              icon: 'none'
            });
          });
        }
      }
    });
  },

  onRefundClick: function(e) {
    const order = e.currentTarget.dataset.order;
    wx.showModal({
      title: '申请退款',
      content: '确定要申请退款吗？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'refund_order',
            data: {
              orderId: order._id
            }
          }).then(() => {
            wx.showToast({
              title: '退款申请已提交',
              icon: 'success'
            });
            this.onPullDownRefresh();
          }).catch(err => {
            console.error('申请退款失败', err);
            wx.showToast({
              title: '申请失败',
              icon: 'none'
            });
          });
        }
      }
    });
  }
})