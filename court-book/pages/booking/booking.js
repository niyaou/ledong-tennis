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
    this.setData({ courtStatus:{} });
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
                  status: found.status === 'free' ? 'available' : 'booked',
                  text: found.status === 'free' ? `${found.price}` : '已预定',
                  courtNumber: courtNumber
                }
              } else {
                return {
                  time,
                  status: 'available',
                  text: '60',
                  courtNumber: courtNumber
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

  getTimesByCourtNumber: function(courtNumber) {
    console.log('----courtNumber---', this.data.courtStatus)
    const found = this.data.courtStatus.find(item => item.courtNumber == courtNumber);
    return found ? found.times : [];
  },

  onCourtTimeTap: function(e) {
    console.log('----e---', e)
    const courtNumber = e.currentTarget.dataset.courtnumber;
    const time = e.currentTarget.dataset.time;
    const text = e.currentTarget.dataset.time;
    const status = e.currentTarget.dataset.time;
    console.log('----courtNumber---time', courtNumber,time,text,status)
    let courtStatus = this.data.courtStatus;
    const times = courtStatus[courtNumber] || [];
    const idx = times.findIndex(item => item.time === time);
    if (idx !== -1) {
      const item = times[idx];
      if (item.status === 'booked') return; // 已预定不可选
    //   // 切换选中状态onOrderSubmit
      item.selected = !item.selected;
      courtStatus = { ...courtStatus, [courtNumber]: [...times] };
      this.setData({ courtStatus });
      this.updateSelectedSummary();
    }
  },

  updateSelectedSummary: function() {
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

  onOrderSubmit: function() {
    // 收集所有选中的项
    const selectedList = [];
    const courtStatus = this.data.courtStatus;
    const campus = '麓坊校区';
    const date = this.data.currentDate;
    Object.keys(courtStatus).forEach(courtNumber => {
      courtStatus[courtNumber].forEach(item => {
        if (item.selected) {
          selectedList.push({
            courtNumber: courtNumber,
            time: item.time,
            text: item.text,
            status: item.status,
            campus: campus,
            date: date
          });
        }
      });
    });
    console.log('已选中的场地时间段:', selectedList);
  }
}); 