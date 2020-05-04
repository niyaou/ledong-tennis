// pages/dealing/dealing.js
const app = getApp()
var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
var http = require('../../utils/http.js')
var utils = require('../../utils/util.js')
const chooseLocation = requirePlugin('chooseLocation');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interval: -1,
    intervalM: -1,
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
    const location = chooseLocation.getLocation();
    console.info(location)

    if (location) {
      this.setData({
        matches: Object.assign(this.data.matches, {
          courtName: location.name,
          courtGPS: `${location.latitude},${location.longitude}`
        })
      })
      http.postReq(`match/matchInfo/${this.data.matches.id}`, app.globalData.jwt, {
        courtName: location.name,
        courtGPS: `${location.latitude},${location.longitude}`
      }, (res) => {
  
      })
    }
    const eventChannel = this.getOpenerEventChannel()
    let that = this
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        matches: data.data,
        openId: app.globalData.openId
      })
      console.info('matches',that.data.matches)
      that.reloadContext()
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.info('xxxxxxxxxx onHide xxxxxxxxxx')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.info('xxxxxxxxxx unload xxxxxxxxxx', this.data.interval)
    clearInterval(this.data.interval)
    clearInterval(this.data.intervalM)
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
  pluginsTap() {
    const key = '64TBZ-IOJWF-4X4JT-JG3BI-WKSEK-QEB7E'; //使用在腾讯位置服务申请的key
    const referer = 'dd'; //调用插件的app的名称

    const location = JSON.stringify({
      latitude: this.data.matches.courtGPS? this.data.matches.courtGPS.split(',')[0]:app.globalData.gps.split(',')[0],
      longitude: this.data.matches.courtGPS? this.data.matches.courtGPS.split(',')[1]:app.globalData.gps.split(',')[1],
    });
    const category = '体育户外,体育场馆,';
    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`
    });
  },
  reloadContext() {
    let that = this
    let holderCount, challengerCount = 0
    holderCount = this.data.sessionContext.filter(i => {
      return i.openId === that.data.matches.holder
    }).length
    challengerCount = this.data.sessionContext.filter(i => {
      return i.openId === that.data.matches.challenger
    }).length
    http.getReq(`match/sessionContext/${that.data.matches.sessionId}?holderCount=${holderCount}&challengerCount=${challengerCount}`, app.globalData.jwt, (res) => {

      let arrs = that.data.sessionContext
      if (res.data.challengerContext != null) {
        arrs = arrs.concat(
          res.data.challengerContext.map(i => {
            return Object.assign(i, {
              openId: that.data.matches.challenger,
              avator: that.data.matches.challengerAvator
            })
          })
        )
      }
      if (res.data.holderContext != null) {
        arrs = arrs.concat(
          res.data.holderContext.map(i => {
            return Object.assign(i, {
              openId: that.data.matches.holder,
              avator: that.data.matches.holderAvator
            })
          })
        )
      }
      if (that.data.interval == -1) {
        let interval = setInterval(() => {
          that.reloadContext()
        }, 2000)

        let intervalM =
          setInterval(() => {
            that.refreshMatches()
          }, 5000)

        that.setData({
          interval: interval,
          intervalM: intervalM
        })
        console.info('----------i set interval ', interval)
      }

      arrs = arrs.sort((o1, o2) => {
        // return (new Date(o1.postTime)).getTime() < (new Date(o2.postTime)) ? 1 : -1
        return o1.postTime < o2.postTime ? 1 : -1
      })

      that.setData({
        sessionContext: arrs
      })
    }, false)
    // console.info('sorted arrs',that.data.sessionContext[0])
  },
  postMessage() {

    let type = app.globalData.openId === this.data.matches.holder ? 0 : 1

    let that = this
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
  refreshMatches() {
    let that = this
    http.getReq(`match/matchInfo/${this.data.matches.id}`, app.globalData.jwt, (res) => {
      // console.info(res.data)
      that.setData({
        matches: res.data
      })
   
    }, false)
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

    var monthDay = ['今天', '明天', '后天'];
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
    if (currentMinute == 0) {
      minuteIndex = 0;
    } else if (currentMinute > 0 && currentMinute <= 10) {
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
    var parseTime = date.getFullYear() + '-'
    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      monthDay = month + "月" + day + "日";
      parseTime += month.toString().padStart(2, "0") + '-' + day.toString().padStart(2, "0")
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = (date1.getMonth() + 1) + "月" + date1.getDate() + "日";
      parseTime += (date1.getMonth() + 1).toString().padStart(2, "0") + '-' + date1.getDate().toString().padStart(2, "0")
    } else if (monthDay === "后天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 2);
      monthDay = (date1.getMonth() + 2) + "月" + date1.getDate() + "日";
      parseTime += (date1.getMonth() + 2).toString().padStart(2, "0") + '-' + date1.getDate().toString().padStart(2, "0")
    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = month + "月" + day + "日";
      parseTime += month.toString().padStart(2, "0") + '-' + day.toString().padStart(2, "0")
    }

    var startDate = monthDay + " " + hours + ":" + minute;
    parseTime += " " + hours.toString().padStart(2, "0") + ":" + minute.toString().padStart(2, "0") + ":00";
    date.getFullYear() + (date.getMonth() + 1)
    that.setData({
      matches: Object.assign(that.data.matches, {
        orderTime: startDate
      })

    })
    http.postReq(`match/matchInfo/${this.data.matches.id}`, app.globalData.jwt, {
      orderTime: parseTime
    }, (res) => {

    })
  },

})