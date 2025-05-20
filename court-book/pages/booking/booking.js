Page({
  data: {
    dateList: [],
    courtList: [],
    timeList: [],
    courtStatus: {}, // { courtId: { time: {status, text} } }
    totalPrice: 0,
    selectedCount: 0,
    court_count: 13,
    currentDate: '',
    phoneNumber: '', // Add phone number field
    needRefresh: false, // Add flag to control refresh
    eventChannel: null, // Add event channel
  },

  onLoad: function () {
    this.initDateList();
    this.initTimeList();
    this.initCourtListByCloud();
    // 默认加载时调用 onDateTabChange，模拟点击第一个日期
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const fullDate = `${yyyy}${mm}${dd}`;
    this.onDateTabChange({ currentTarget: { dataset: { index: 0, fullDate } } });


    const app = getApp();
    const eventChannel = app.globalData.eventBus;
    if (eventChannel) {
      this.setData({ eventChannel });
      // Listen for refresh event
      eventChannel.on('refreshBooking', () => {
        this.refreshPage();
      });
    }

    // Add global event bus listener
    app.globalData.eventBus.on('refreshBookingPage', () => {
      this.refreshPage();
    });
  },

  onUnload: function() {
    // Clean up event bus listener
    const app = getApp();
    app.globalData.eventBus.off('refreshBookingPage');
    app.globalData.eventBus.off('refreshBooking');
  },

  // Add refresh method
  refreshPage: function() {
    console.log('Refreshing booking page...');
    const phoneNumber = wx.getStorageSync('phoneNumber');
    this.setData({ 
      phoneNumber: phoneNumber 
    });
    this.initCourtStatusByCloud(this.data.currentDate);
  },

  onShow: function() {
    console.log('----onshow---')
    // Read phone number from storage every time page is shown
    const phoneNumber = wx.getStorageSync('phoneNumber');
    this.setData({ 
      phoneNumber: phoneNumber 
    });
    
    // Only refresh if needed
    if (this.data.needRefresh) {
      this.initCourtStatusByCloud(this.data.currentDate);
      this.setData({ needRefresh: false });
    }
  },

  initDateList: function () {
    const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dateList = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const weekStr = i === 0 ? '今天' : weekMap[d.getDay()];
      dateList.push({
        dateStr: `${month}.${day}`,
        weekStr,
        selected: i === 0
      });
    }
    this.setData({ dateList });
    console.log('日期列表:', dateList);
  },

  initTimeList: function () {
    const timeList = [];
    for (let h = 6; h < 24; h++) {
      timeList.push({ time: `${h < 10 ? '0' + h : h}:00` });
      timeList.push({ time: `${h < 10 ? '0' + h : h}:30` });
    }
    // timeList.push({ time: '24:00' });
    this.setData({ timeList });
  },

  initCourtStatusByCloud: function (date) {
    this.setData({ courtStatus: {} });
    wx.cloud.callFunction({
      name: 'get_court_order',
      data: {
        date: date,
        campus: '麓坊校区'
      },
      success: res => {
        if (res.result && res.result.success) {
          // 先获取所有场地号
          const courtNumbers = [...new Set(res.result.data.map(item => item.courtNumber))];
          // 获取所有时间点
          const timeList = this.data.timeList.map(t => t.time);

          // 构造结构，courtStatus为对象，key为courtNumber，value为times数组
          const courtStatus = {};
          courtNumbers.forEach(courtNumber => {
            const courtData = res.result.data.filter(item => item.courtNumber === courtNumber);
            const times = timeList.map(time => {
              const found = courtData.find(item => item.start_time === time);
              if (found) {
                return {
                  time: found.start_time,
                  status: found.status === 'free' ? 'available' :found.status,
                  text: found.status === 'free' ? `${found.price}` :  found.status === 'locked' ? '已锁定' : '已预定',
                  courtNumber: courtNumber,
                  booked_by: found.booked_by || ''
                }
              } else {
                return {
                  time,
                  status: 'available',
                  text: '60',
                  courtNumber: courtNumber,
                  booked_by: ''
                }
              }
            });
            courtStatus[courtNumber] = times;
          });

          this.setData({ courtStatus });
          console.log('云函数返回场地状态:', courtStatus);
        } else {
          wx.showToast({ title: '获取场地状态失败', icon: 'none' });
          console.error('云函数返回失败:', res.result);
        }
      },
      fail: err => {
        wx.showToast({ title: '云函数调用失败', icon: 'none' });
        console.error('云函数调用失败:', err);
      }
    })
  },

  initCourtStatus: function () {
    // 80%未预定（显示价格60），20%已预定（显示已预定）
    const courtStatus = {};
    const courtList = this.data.courtList.length ? this.data.courtList : (() => {
      const arr = [];
      for (let i = 1; i <= this.data.court_count; i++) arr.push({ id: i, name: `${i}号场` });
      return arr;
    })();
    const timeList = this.data.timeList.length ? this.data.timeList : (() => {
      const arr = [];
      for (let h = 6; h < 24; h++) {
        arr.push({ time: `${h < 10 ? '0' + h : h}:00` });
        arr.push({ time: `${h < 10 ? '0' + h : h}:30` });
      }
      // arr.push({ time: '24:00' });
      return arr;
    })();

    courtList.forEach(court => {
      courtStatus[court.id] = {};
      timeList.forEach(t => {
        if (Math.random() < 0.2) {
          courtStatus[court.id][t.time] = { status: 'booked', text: '已预定' };
        } else {
          courtStatus[court.id][t.time] = { status: 'available', text: '￥60' };
        }
      });
    });

    this.setData({ courtStatus });

    // 调试输出
    console.log('场地预定状态数据结构:', {
      '示例场地1的状态': courtStatus[1],
      '示例场地1的6:00状态': courtStatus[1]['06:00'],
      '示例场地1的6:30状态': courtStatus[1]['06:30'],
      '示例场地1的24:00状态': courtStatus[1]['24:00'],
      '所有场地ID': Object.keys(courtStatus),
      '场地1的所有时间点': Object.keys(courtStatus[1])
    });
    console.log('courtStatus:', courtStatus);
  },

  initCourtListByCloud: function () {
    wx.cloud.callFunction({
      name: 'get_court_list_by_section',
      data: {
        campus: '麓坊校区'
      },
      success: res => {
        if (res.result && res.result.success) {
          this.setData({ courtList: res.result.data });
          console.log('云函数返回场地列表:', res.result.data);
        } else {
          wx.showToast({ title: '获取场地失败', icon: 'none' });
          console.error('云函数返回失败:', res.result);
        }
      },
      fail: err => {
        wx.showToast({ title: '云函数调用失败', icon: 'none' });
        console.error('云函数调用失败:', err);
      }
    });
  },

  onDateTabChange: function (e) {
    const idx = e.currentTarget.dataset.index;
    const dateList = this.data.dateList.map((item, i) => ({ ...item, selected: i === idx }));
    this.setData({ dateList });

    // 打印被点击的日期和索引
    console.log('点击的日期索引:', idx);
    console.log('点击的日期对象:', this.data.dateList[idx]);

    // 计算完整的年月日
    const today = new Date();
    const clickedDate = new Date(today.getTime() + idx * 24 * 60 * 60 * 1000);
    const yyyy = clickedDate.getFullYear();
    const mm = String(clickedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(clickedDate.getDate()).padStart(2, '0');
    const fullDate = `${yyyy}${mm}${dd}`;
    console.log('点击的完整日期:', fullDate);
    // 这里可以根据日期切换刷新 courtStatus
    this.setData({ currentDate: fullDate });
    this.initCourtStatusByCloud(fullDate);
  },

  getTimesByCourtNumber: function (courtNumber) {
    console.log('----courtNumber---', this.data.courtStatus)
    const found = this.data.courtStatus.find(item => item.courtNumber == courtNumber);
    return found ? found.times : [];
  },

  onCourtTimeTap: function (e) {
    console.log('----e---', e)
    const courtNumber = e.currentTarget.dataset.courtnumber;
    const time = e.currentTarget.dataset.time;
    const text = e.currentTarget.dataset.time;
    const status = e.currentTarget.dataset.time;
    console.log('----courtNumber---time', courtNumber, time, text, status)
    let courtStatus = this.data.courtStatus;
    const times = courtStatus[courtNumber] || [];
    const idx = times.findIndex(item => item.time === time);
    if (idx !== -1) {
      const item = times[idx];
      // if (item.status === 'booked' || item.status === 'locked') return; // 已预定不可选
      if (item.status === 'booked' || item.status === 'locked') {
        this.setData({ needRefresh: true }); // Set flag before navigation
        wx.navigateTo({
          url: '/pages/myOrder/orderlist'
        });
        return
      };
      //   // 切换选中状态onOrderSubmit
      item.selected = !item.selected;
      courtStatus = { ...courtStatus, [courtNumber]: [...times] };
      this.setData({ courtStatus });
      this.updateSelectedSummary();
    }
  },

  updateSelectedSummary: function () {
    let selectedCount = 0;
    let totalPrice = 0;
    const courtStatus = this.data.courtStatus;
    Object.values(courtStatus).forEach(times => {
      times.forEach(item => {
        if (item.selected) {
          selectedCount += 0.5;
          const price = parseFloat(item.text.replace(/[^\d.]/g, ''));
          if (!isNaN(price)) totalPrice += price;
        }
      });
    });
    this.setData({ selectedCount, totalPrice });
  },

  onOrderSubmit: function () {
    // 收集所有选中的项
    const selectedList = [];
    const courtStatus = this.data.courtStatus;
    const campus = '麓坊校区';
    const date = this.data.currentDate;
 
    Object.keys(courtStatus).forEach(courtNumber => {
      courtStatus[courtNumber].forEach(item => {
        if (item.selected) {
          // 计算结束时间（+30分钟）
          let [h, m] = item.time.split(':').map(Number);
          m += 30;
          if (m >= 60) { h += 1; m -= 60; }
          const end_time = `${h < 10 ? '0' + h : h}:${m === 0 ? '00' : '30'}`;
          // 价格
          const price = parseFloat(item.text.replace(/[^\d.]/g, '')) || 0;
          // 构造court_id: 场地号+日期+开始时间
          const court_id = `${courtNumber}_${date}_${item.time}`;
          selectedList.push({
            court_id,
            campus: campus,
            courtNumber: courtNumber,
            date: date,
            start_time: item.time,
            end_time: end_time,
            status: 'locked',
            price: price,
            booked_by: this.data.phoneNumber,
            is_verified: false
          });
        }
      });
    });
    console.log('已选中的场地时间段:', selectedList);

    if (selectedList.length === 0) {
      wx.showToast({ title: '请选择时间段', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '加载中...' });
    // 批量调用云函数
    wx.cloud.callFunction({
      name: 'update_court_order',
      data: {
        data: selectedList
      },
      success: res => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '场地已锁定，请尽快支付',
          showCancel: false,
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.showLoading({ title: '加载中...' });
              this.initCourtStatusByCloud(date);
              console.log('云函数返回:', res.result.results);
              this.onCreateOrderPayment(res.result.results, date);
              wx.hideLoading();
            }
          }
        });
      },
      fail: err => {
        wx.showToast({ title: '预订失败', icon: 'none' });
        console.error('预订失败:', err);
      }
    });
  },
  // 生成随机字符串
  generateNonceStr() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const timestamp = Date.now().toString(36); // 将时间戳转换为36进制
    const randomPart = Math.random().toString(36).substring(2, 8); // 获取随机数的一部分
    result = timestamp + randomPart;
    
    // 如果长度不够32位，继续添加随机字符
    while (result.length < 32) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // 如果超过32位，截取前32位
    return result.substring(0, 32);
  },
  onCreateOrderPayment: function (order_objs,date) {

    const court_ids = []
    order_objs.forEach(item => {
      court_ids.push(item.court_id)
    })
    const orderParams = {
      phoneNumber: this.data.phoneNumber,
      total_fee: court_ids.length/100,
      court_ids,
      nonceStr: this.generateNonceStr()
    };
    wx.showLoading({ title: '加载中...' });
    // 调用云函数创建订单
    wx.cloud.callFunction({
      name: 'pay_order_create',
      data: orderParams,
      success: (res) => {
        console.log('创建订单成功', res);
        if (res.result && res.result.payment) {
          // 调用微信支付
          wx.requestPayment({
            ...res.result.payment,
            // ...{"appId":"wx3250e72f7d776124","timeStamp":"1747490082","nonceStr":"USt2HgGHHEbuoZX3","package":"prepay_id=wx17215442344454c5ff540ae85f52460001","signType":"MD5","paySign":"4908B68D11149CE2511F88CC50272E3A"},
            success: (payRes) => {
              wx.hideLoading();
              wx.showToast({
                title: '支付成功',
                icon: 'success'
              });
              console.log('支付成功', payRes);
              this.initCourtStatusByCloud(date);
            },
            fail: (err) => {
              wx.hideLoading();
              wx.showToast({
                title: '支付失败',
                icon: 'error'
              });
              console.error('支付失败', err);
            }
          });
        } else {
          wx.hideLoading();
          wx.showToast({
            title: '创建订单失败',
            icon: 'error'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({
          title: '创建订单失败',
          icon: 'error'
        });
        console.error('创建订单失败', err);
      }
    });


  },

  onGoToLogin: function() {

    wx.switchTab({
      url: '/pages/member/member'
    });
    console.log('--------onGoToLogin-------')
  },
}); 