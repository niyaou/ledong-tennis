// pages/dealing/dealing.js
const app = getApp()
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
var http = require('../../utils/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matches: {},
    openId: getApp().globalData.openId,
    totalBarHeight: getApp().globalData.totalBarHeight,
    holderAvator: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epUY765qAmPLVQAyMV2bicsbDQTQD12gm3qa5cuVzdcO4GkHXZuJLBYExoaEHpHBFwTDiauuY9NicpwQ/132',
    holderName: '范大将军',
    challengerAvator: '../../icon/challenger.jpg',
    challengerName: 'Jerry',
    inputValue: '',
    arrs: [1],
    sessionContext: [],

    startDate: "请选择日期",

    multiArray: [
      ['今天', '明天', '3-2', '3-3', '3-4', '3-5'],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 10, 20]
    ],
    multiIndex: [0, 0, 0],


    multiArray: [
      ['今天', '明天', '3-2', '3-3', '3-4', '3-5'],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 10, 20]
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const eventChannel = this.getOpenerEventChannel()
    let that = this
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        matches: data.data,
        openId: app.globalData.openId
      })
      console.info('app.globalData.openId',app.globalData.openId)
      console.info('data.data', data.data)
      that.reloadContext()
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  reloadContext() {
    let that = this
    http.getReq(`match/sessionContext/${that.data.matches.sessionId}?holderCount=0&challengerCount=0`, app.globalData.jwt, (res) => {
      console.info(res)
      let arrs=that.data.sessionContext
      if (res.data.challengerContext != null) {
        // that.setData({
          // sessionContext: 
          arrs=arrs.concat(   
            res.data.challengerContext.map(i => {
              return Object.assign(i, {
                openId: that.data.matches.challenger,
                avator: that.data.matches.challengerAvator
              })
            })
            )
            // console.info('challengerContext',arrs)
        // })
      }
      if (res.data.holderContext != null) {
        // that.setData({
        //   sessionContext: that.data.sessionContext.concat(
        //     res.data.holderContext.map(i => {
        //       return Object.assign(i, {
        //         openId: that.data.matches.holder,
        //         avator: that.data.matches.holderAvator
        //       })
        //     })
        //   )
        // })
        arrs=arrs.concat(   
          res.data.holderContext.map(i => {
            return Object.assign(i, {
              openId: that.data.matches.holder,
              avator: that.data.matches.holderAvator
            })
          })
          )
          // console.info('holderContext',arrs)




      }

 that.setData({
          sessionContext:arrs.sort((o1,o2)=>{
            return (new Date(o1.postTime)).getTime()<(new Date(o2.postTime))?1:-1
          
        })
    })


    })
  },
  postMessage() {
    console.info(this.data.inputValue)
    let type = app.globalData.openId === this.data.matches.holder ? 0 : 1
    http.postReq(`match/sessionContext/${this.data.matches.sessionId}/${type}`, app.globalData.jwt, {
      context: this.data.inputValue
    }, (res) => {
      console.info(res.data)
    })
  },
  bindInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  backtoIndex() {
    wx.navigateBack({
      complete: (res) => {},
    })
  },
  pickerTap: function () {
    date = new Date();

    var monthDay = ['今天', '明天', '后天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    // 月-日
    for (var i = 3; i <= 7; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
    }

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    if (data.multiIndex[0] === 0) {
      if (data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }

    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;

    this.setData(data);
  },




  bindMultiPickerColumnChange: function (e) {
    date = new Date();

    var that = this;

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {

        that.loadData(hours, minute);

      } else {
        that.loadHoursMinute(hours, minute);
      }

      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;

      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0) {

        // 如果第一列为 '今天'并且第二列为当前时间
        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },

  loadData: function (hours, minute) {

    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(i);
      }
    }
  },

  loadHoursMinute: function (hours, minute) {
    // 时
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(i);
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(i);
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(i);
    }
  },

  bindStartMultiPickerChange: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      monthDay = month + "月" + day + "日";
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";

    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = month + "月" + day + "日";
    }

    var startDate = monthDay + " " + hours + ":" + minute;
    that.setData({
      matches: Object.assign(that.data.matches, {
        playingTime: startDate
      })

    })
  },

})