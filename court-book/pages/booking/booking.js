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
    lastUpdateTime: 0, // 记录最后更新时间，用于防抖
  },

  onLoad: function () {
    // 初始化时读取手机号
    const phoneNumber = wx.getStorageSync('phoneNumber');
    this.setData({ 
      phoneNumber: phoneNumber 
    });
    
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

    // 启动自动刷新定时器（每30秒刷新一次）
    this.startAutoRefresh();
  },

  onUnload: function() {
    // Clean up event bus listener
    const app = getApp();
    app.globalData.eventBus.off('refreshBookingPage');
    app.globalData.eventBus.off('refreshBooking');
    
    // 清除自动刷新定时器
    this.stopAutoRefresh();
  },

  openLocation: function() {
    wx.openLocation({
      latitude:30.461094427278926,  // 麓坊校区的纬度
      longitude: 104.05406090412829, // 麓坊校区的经度
      name: '乐动网球·麓坊校区',
      address: '麓坊街93号',
      scale: 18
    })
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
    for (let i = 0; i < 7; i++) {
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
    for (let h = 7; h < 24; h++) {
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
          // 获取管理员列表
          const app = getApp();
          const managerList = app.globalData.managerList || [];
          
          // 先获取所有场地号
          const courtNumbers = [...new Set(res.result.data.map(item => ({courtNumber:item.courtNumber, price:item.price})))];
          // 获取所有时间点
          const timeList = this.data.timeList.map(t => t.time);
          // 构造结构，courtStatus为对象，key为courtNumber，value为times数组
          const courtStatus = {};
          courtNumbers.forEach((order) => {
            const courtData = res.result.data.filter(item => item.courtNumber === order.courtNumber);
            const times = timeList.map(time => {
              const found = courtData.find(item => item.start_time === time);
              if (found) {
                // 判断订场人是否为管理员
                const isBookedByManager = found.booked_by && managerList.includes(found.booked_by);
                
                return {
                  time: found.start_time,
                  status: found.status === 'free' ? 'available' : found.status,
                  text: found.status === 'free' ? `${found.price}` : found.status === 'locked' ? '已锁定' : '已预定',
                  courtNumber: order.courtNumber,
                  booked_by: found.booked_by || '',
                  isBookedByManager: isBookedByManager
                }
              } else {
                return {
                  time,
                  status: 'available',
                  text: order.price,
                  courtNumber: order.courtNumber,
                  booked_by: '',
                  isBookedByManager: false
                }
              }
            });
            courtStatus[order.courtNumber] = times;
          });

          this.setData({ courtStatus });
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
    const found = this.data.courtStatus.find(item => item.courtNumber == courtNumber);
    return found ? found.times : [];
  },

  onCourtTimeTap: function (e) {
    const { courtnumber, time } = e.currentTarget.dataset;
    const courtStatusAll = this.data.courtStatus;
    const times = courtStatusAll[courtnumber] || [];
    const item = times.find(i => i.time === time);
    const phoneNumber = this.data.phoneNumber;

    // Get global managerList and check if user is manager
    const app = getApp();
    const managerList = app.globalData.managerList;
    const isManager = managerList && managerList.includes(phoneNumber);

    if (item.booked_by && item.booked_by !== phoneNumber) {
      if (isManager) {
        wx.showModal({
          title: '已被预订',
          content: `预订人电话：${item.booked_by}`,
          showCancel: false
        });
      }
      return;
    }

    // 检查日期和时间是否在当前时间之后
    const now = new Date();
    const selectedDate = new Date(this.data.currentDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
    const [selectedHour, selectedMinute] = time.split(':').map(Number);
    selectedDate.setHours(selectedHour, selectedMinute, 0, 0);

    if (selectedDate <= now) {
      wx.showToast({
        title: '无法预订过去的时间',
        icon: 'none'
      });
      return;
    }

    // // 检查用户权限（只有管理员可以预订）
    // if (!isManager) {
    //   wx.showToast({
    //     title: '订场暂未开放，尽请期待',
    //     icon: 'none'
    //   });
    //   return;
    // }

    // 检查日期是否超过限制（管理员7天，普通用户只能预约今天和明天）
    if (isManager) {
      // 管理员可以预约7天内
      const maxDays = 7;
      const maxDaysFromNow = new Date(now.getTime() + maxDays * 24 * 60 * 60 * 1000);
      
      if (selectedDate > maxDaysFromNow) {
        wx.showToast({
          title: `只能预约${maxDays}天内的场地`,
          icon: 'none'
        });
        return;
      }
    } else {
      // 普通用户只能预约今天和明天
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const dayAfterTomorrow = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      
      const selectedDateOnly = new Date(selectedDate);
      selectedDateOnly.setHours(0, 0, 0, 0);
      if (selectedDateOnly >= dayAfterTomorrow) {
        wx.showToast({
          title: '只能预约今明两天场地',
          icon: 'none'
        });
        return;
      }
    }

    let courtStatus = this.data.courtStatus;
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
      courtStatus = { ...courtStatus, [courtnumber]: [...times] };
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
    // Round totalPrice to 2 decimal places
    totalPrice = Math.round(totalPrice * 100) / 100;
    this.setData({ selectedCount, totalPrice });
  },

  clearSelectedStatus: function () {
    // 清空所有选中状态
    const courtStatus = this.data.courtStatus;
    Object.keys(courtStatus).forEach(courtNumber => {
      courtStatus[courtNumber].forEach(item => {
        item.selected = false;
      });
    });
    this.setData({ 
      courtStatus,
      selectedCount: 0,
      totalPrice: 0
    });
  },

  startAutoRefresh: function () {
    // 防抖：如果已经有定时器在运行，先停止
    this.stopAutoRefresh();
    
    // 启动自动刷新定时器
    this.autoRefreshTimer = setInterval(() => {
      if (this.data.currentDate) {
        console.log('自动刷新场地状态...');
        this.updateCourtStatusIncrementally(this.data.currentDate);
      }
    }, 30000); // 每30秒刷新一次，但只更新状态，不重新渲染
  },

  stopAutoRefresh: function () {
    // 停止自动刷新定时器
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = null;
    }
  },

  updateCourtStatusIncrementally: function (date) {
    // 防抖：如果距离上次更新不足5秒，则跳过
    const now = Date.now();
    if (now - this.data.lastUpdateTime < 5000) {
      return;
    }
    
    // 增量更新场地状态，不重新渲染整个页面
    wx.cloud.callFunction({
      name: 'get_court_order',
      data: {
        date: date,
        campus: '麓坊校区'
      },
      success: res => {
        if (res.result && res.result.success) {
          // 获取管理员列表
          const app = getApp();
          const managerList = app.globalData.managerList || [];
          
          // 更新最后更新时间
          this.setData({ lastUpdateTime: now });
          
          // 先获取所有场地号
          const courtNumbers = [...new Set(res.result.data.map(item => ({courtNumber:item.courtNumber, price:item.price})))];
          // 获取所有时间点
          const timeList = this.data.timeList.map(t => t.time);
          
          // 构造新的状态数据
          const newCourtStatus = {};
          courtNumbers.forEach((order) => {
            const courtData = res.result.data.filter(item => item.courtNumber === order.courtNumber);
            const times = timeList.map(time => {
              const found = courtData.find(item => item.start_time === time);
              if (found) {
                // 判断订场人是否为管理员
                const isBookedByManager = found.booked_by && managerList.includes(found.booked_by);
                
                return {
                  time: found.start_time,
                  status: found.status === 'free' ? 'available' : found.status,
                  text: found.status === 'free' ? `${found.price}` : found.status === 'locked' ? '已锁定' : '已预定',
                  courtNumber: order.courtNumber,
                  booked_by: found.booked_by || '',
                  isBookedByManager: isBookedByManager
                }
              } else {
                return {
                  time,
                  status: 'available',
                  text: order.price,
                  courtNumber: order.courtNumber,
                  booked_by: '',
                  isBookedByManager: false
                }
              }
            });
            newCourtStatus[order.courtNumber] = times;
          });

          // 智能更新：只更新状态发生变化的部分
          this.updateCourtStatusSmartly(newCourtStatus);
        }
      },
      fail: err => {
        console.error('增量更新失败:', err);
      }
    });
  },

  updateCourtStatusSmartly: function (newCourtStatus) {
    const currentCourtStatus = this.data.courtStatus;
    let hasChanges = false;
    let hasImportantChanges = false; // 重要变化（如锁定状态变化）
    const updatedCourtStatus = { ...currentCourtStatus };

    // 遍历新状态，只更新发生变化的部分
    Object.keys(newCourtStatus).forEach(courtNumber => {
      const newTimes = newCourtStatus[courtNumber];
      const currentTimes = currentCourtStatus[courtNumber];
      
      if (!currentTimes) {
        // 新场地，直接添加
        updatedCourtStatus[courtNumber] = newTimes;
        hasChanges = true;
        return;
      }

      // 检查时间点状态是否有变化
      const updatedTimes = [];
      let courtHasChanges = false;
      
      newTimes.forEach((newTime, index) => {
        const currentTime = currentTimes[index];
        if (!currentTime || 
            currentTime.status !== newTime.status || 
            currentTime.text !== newTime.text ||
            currentTime.booked_by !== newTime.booked_by ||
            currentTime.isBookedByManager !== newTime.isBookedByManager) {
          // 状态发生变化，但保持选中状态
          updatedTimes.push({
            ...newTime,
            selected: currentTime ? currentTime.selected : false
          });
          courtHasChanges = true;
          
          // 检查是否是重要变化（状态从可用变为锁定或预订）
          if (currentTime && 
              (currentTime.status === 'available' || currentTime.status === 'free') && 
              (newTime.status === 'locked' || newTime.status === 'booked')) {
            hasImportantChanges = true;
          }
        } else {
          // 状态未变化，保持原有状态
          updatedTimes.push(currentTime);
        }
      });

      if (courtHasChanges) {
        updatedCourtStatus[courtNumber] = updatedTimes;
        hasChanges = true;
      }
    });

    // 只有在有变化时才更新数据
    if (hasChanges) {
      console.log('检测到场地状态变化，更新中...');
      this.setData({ courtStatus: updatedCourtStatus });
      this.updateSelectedSummary(); // 重新计算选中状态
      
      // 如果有重要变化，显示轻微提示
      if (hasImportantChanges) {
        wx.showToast({
          title: '场地状态已更新',
          icon: 'none',
          duration: 1500
        });
      }
    }
  },

  onOrderSubmit: function () {
    // Get global managerList
    const app = getApp();
    const managerList = app.globalData.managerList;
    console.log('Global managerList:', managerList);

    // Get user's phone number and check if in managerList
    const userPhone = this.data.phoneNumber;
    const isManager = managerList && managerList.includes(userPhone);
    console.log('User phone:', userPhone);
    console.log('Is user a manager:', isManager);

    // 收集所有选中的项
    const selectedList = [];
    let total_fee = 0;
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
          total_fee += price;
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
    // Round total_fee to 2 decimal places
    total_fee = Math.round(total_fee * 100) / 100;
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
        
        // 检查是否有冲突错误
        const hasConflict = res.result.results.some(result => 
          result.type === 'conflict' || 
          (result.success === false && result.error && 
           (result.error.includes('冲突') || result.error.includes('锁定')))
        );
        
        if (hasConflict) {
          // 收集所有冲突的错误信息
          const conflictErrors = res.result.results
            .filter(result => result.success === false && result.error)
            .map(result => result.error)
            .filter((error, index, arr) => arr.indexOf(error) === index); // 去重
          
          // 有冲突，使用增量更新刷新页面状态并提示用户
          this.updateCourtStatusIncrementally(date);
          wx.showModal({
            title: '预订冲突',
            content: conflictErrors.length > 0 ? conflictErrors.join('\n') : '场地已被预订',
            showCancel: false,
            success: () => {
              // 清空选中状态
              this.clearSelectedStatus();
            }
          });
          return;
        }
        
        // 检查是否所有操作都成功
        const allSuccess = res.result.results.every(result => result.success);
        if (!allSuccess) {
          wx.showModal({
            title: '部分预订失败',
            content: '部分场地预订失败，请重试',
            showCancel: false,
            success: () => {
              this.updateCourtStatusIncrementally(date);
              this.clearSelectedStatus();
            }
          });
          return;
        }
        
        wx.showModal({
          title: '特别提醒：24小时内开始的预订无法取消',
          content: '场地已锁定，请尽快支付',
          showCancel: false,
          success: (modalRes) => {
            if (modalRes.confirm) {
              wx.showLoading({ title: '加载中...' });
              this.updateCourtStatusIncrementally(date);
              console.log('云函数返回:', res.result.results);
              this.onCreateOrderPayment(res.result.results, date,total_fee);
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
  onCreateOrderPayment: function (order_objs,date,price) {
    // Get global managerList
    const app = getApp();
    const managerList = app.globalData.managerList;
    console.log('Global managerList:', managerList);

    // Get user's phone number and check if in managerList
    const userPhone = this.data.phoneNumber;
    const isManager = managerList && managerList.includes(userPhone);
    console.log('User phone:', userPhone);
    console.log('Is user a manager:', isManager);

    const court_ids = []
    order_objs.forEach(item => {
      court_ids.push(item.court_id)
    })
    const orderParams = {
      phoneNumber: this.data.phoneNumber,
      // total_fee: court_ids.length/100,
      total_fee: price,
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
          if (isManager) {
            // Skip payment for managers
            wx.hideLoading();
            wx.showToast({
              title: '管理员预订成功',
              icon: 'success'
            });
            console.log('管理员预订成功');
            setTimeout(() => {
              this.initCourtStatusByCloud(date);
            }, 1500);
          } else {
            // 调用微信支付
            wx.requestPayment({
              ...res.result.payment,
              success: (payRes) => {
                wx.hideLoading();
                wx.showToast({
                  title: '支付成功',
                  icon: 'success'
                });
                console.log('支付成功', payRes);
                setTimeout(() => {
                  this.initCourtStatusByCloud(date);
                }, 1500);
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
          }
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