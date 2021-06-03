// pages/schedule/schedule.js
// 引入插件安装器
import plugin from '../../component/plugins/index'

// 设置代办
import todo from '../../component/plugins/todo'

plugin
  .use(todo)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionBtn: [
      {
        text: '跳转指定日期',
        action: 'jump',
        color: 'olive'
      },
      {
        text: '获取当前已选',
        action: 'getSelectedDates',
        color: 'red'
      },
      {
        text: '取消选中日期',
        action: 'cancelSelectedDates',
        color: 'mauve'
      },
      {
        text: '设置待办事项',
        action: 'setTodos',
        color: 'cyan'
      },
      {
        text: '删除指定代办',
        action: 'deleteTodos',
        color: 'pink'
      },
      {
        text: '清空待办事项',
        action: 'clearTodos',
        color: 'red'
      },
      {
        text: '获取所有代办',
        action: 'getTodos',
        color: 'purple'
      },
      {
        text: '禁选指定日期',
        action: 'disableDates',
        color: 'olive'
      },
      {
        text: '指定可选区域',
        action: 'enableArea',
        color: 'pink'
      },
      {
        text: '指定特定可选',
        action: 'enableDates',
        color: 'red'
      },
      {
        text: '选中指定日期',
        action: 'setSelectedDates',
        color: 'cyan'
      },
      {
        text: '周月视图切换',
        action: 'switchView',
        color: 'orange'
      },
      {
        text: '获取自定义配置',
        action: 'getConfig',
        color: 'olive'
      },
      {
        text: '获取日历面板日期',
        action: 'getCalendarDates',
        color: 'purple'
      }
    ],
    calendarConfig: {
      multi: false, // 是否开启多选,
      weekMode: false, // 周视图模式
      theme: 'elegant', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题色在参考 /theme 文件夹
      showLunar: false, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      inverse: true, // 单选模式下是否支持取消选中,
      markToday: '今', // 当天日期展示不使用默认数字，用特殊文字标记
      hideHeader: false, // 隐藏日历头部操作栏
      takeoverTap: true, // 是否完全接管日期点击事件（日期不会选中)
      emphasisWeek: true, // 是否高亮显示周末日期
      chooseAreaMode: true, // 开启日期范围选择模式，该模式下只可选择时间段
      showHolidays: true, // 显示法定节假日班/休情况，需引入holidays插件
      showFestival: true, // 显示节日信息（如教师节等），需引入holidays插件
      highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      // defaultDate: '2018-3-6', // 默认选中指定某天，如需选中需配置 autoChoosedWhenJump: true
      preventSwipe: false, // 是否禁用日历滑动切换月份
      firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
      autoChoosedWhenJump: true, // 设置默认日期及跳转到指定日期后是否需要自动选中
      // disableMode: {
      //   // 禁用某一天之前/之后的所有日期
      //   type: 'after', // [‘before’, 'after']
      //   date: '2020-3-24' // 无该属性或该属性值为假，则默认为当天
      // },
    
    }
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
  /**
   * 日历初次渲染完成后触发事件，如设置事件标记
   */
  afterCalendarRender(e) {
    console.log('afterCalendarRender', e)
  },
  /**
   * 日期点击事件（此事件会完全接管点击事件），需自定义配置 takeoverTap 值为真才能生效
   * currentSelect 当前点击的日期
   */
  takeoverTap(e) {
    console.log('takeoverTap', e.detail) // => { year: 2019, month: 12, date: 3, ...}
  },
  /**
   * 选择日期后执行的事件
   */
  afterTapDate(e) {
    console.log('afterTapDate', e.detail) // => { year: 2019, month: 12, date: 3, ...}
  },
  /**
   * 当日历滑动时触发
   */
  onSwipe(e) {
    console.log('onSwipe', e.detail)
  },
  /**
   * 当日历滑动时触发(适用于周视图)
   * 可在滑动时按需在该方法内获取当前日历的一些数据
   */
  whenChangeWeek(e) {
    console.log('whenChangeWeek', e.detail)
  },
  /**
   * 当改变月份时触发
   * => current 当前年月 / next 切换后的年月
   */
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail)
    // => { current: { month: 3, ... }, next: { month: 4, ... }}
  },
  generateRandomDate(type) {
    let random = ~~(Math.random() * 10)
    switch (type) {
      case 'year':
        random = 201 * 10 + ~~(Math.random() * 10)
        break
      case 'month':
        random = (~~(Math.random() * 10) % 9) + 1
        break
      case 'date':
        random = (~~(Math.random() * 100) % 27) + 1
        break
      default:
        break
    }
    return random
  },
  handleAction(e) {
    const { action, disable } = e.currentTarget.dataset
    if (disable) {
      this.showToast('抱歉，还不支持～😂')
    }
    this.setData({
      rst: []
    })
    const calendar = this.selectComponent('#calendar').calendar
    const { year, month } = calendar.getCurrentYM()
    switch (action) {
      case 'config':
        calendar
          .setCalendarConfig({
            showLunar: false,
            theme: 'elegant',
            multi: true
          })
          .then(conf => {
            console.log('设置成功：', conf)
          })
        break
      case 'getConfig':
        const config = calendar.getCalendarConfig()
        this.showToast('请在控制台查看结果')
        console.log('自定义配置: ', config)
        break
      case 'jump': {
        const year = this.generateRandomDate('year')
        const month = this.generateRandomDate('month')
        const date = this.generateRandomDate('date')
        const config = calendar.getCalendarConfig()
        if (config.weekMode) {
          calendar['weekModeJump']({ year, month, date })
        } else {
          calendar[action]({ year, month, date })
        }
        break
      }
      case 'getSelectedDates': {
        const selected = calendar[action]()
        if (!selected || !selected.length)
          return this.showToast('当前未选择任何日期')
        this.showToast('请在控制台查看结果')
        console.log('get selected dates: ', selected)
        const rst = selected.map(item => JSON.stringify(item))
        this.setData({
          rst
        })
        break
      }
      case 'cancelSelectedDates':
        const selected = calendar.getSelectedDates()
        calendar[action](selected)
        break
      case 'setTodos': {
       let d= this.generateRandomDate('date')
        const dates = [
          {
            year,
            month,
            date: d,
            todoText: Math.random() * 10 > 5 ? '领奖日' : '',
            obj:{key:123}
          }, {
            year,
            month,
            date: d,
            todoText: Math.random() * 10 > 5 ? '领奖日' : '',
            obj:{key:456}
          }
        ]
        calendar[action]({
          showLabelAlways: true,
          dates
        })
        console.log('set todo: ', dates)
        break
      }
      case 'deleteTodos': {
        const todos = [...calendar.getTodos()]
        if (todos.length) {
          calendar[action]([todos[0]]).then(() => {
            const _todos = [...calendar.getTodos()]
            setTimeout(() => {
              const rst = _todos.map(item => JSON.stringify(item))
              this.setData(
                {
                  rst
                },
                () => {
                  console.log('delete todo: ', todos[0])
                }
              )
            })
          })
        } else {
          this.showToast('没有待办事项')
        }
        break
      }
      case 'clearTodos':
        const todos = [...calendar.getTodos()]
        if (!todos || !todos.length) {
          return this.showToast('没有待办事项')
        }
        calendar[action]()
        break
      case 'getTodos': {
        const selected = calendar[action]()
        if (!selected || !selected.length)
          return this.showToast('未设置待办事项')
        const rst = selected.map(item => JSON.stringify(item))
        rst.map(item => JSON.stringify(item))
        this.setData({
          rst
        })
        break
      }
      case 'disableDates':
        calendar[action]([
          {
            year,
            month,
            date: this.generateRandomDate('date')
          }
        ])
        break
      case 'enableArea': {
        let sDate = this.generateRandomDate('date')
        let eDate = this.generateRandomDate('date')
        if (sDate > eDate) {
          ;[eDate, sDate] = [sDate, eDate]
        }
        const area = [`${year}-${month}-${sDate}`, `${year}-${month}-${eDate}`]
        calendar[action](area)
        this.setData({
          rstStr: JSON.stringify(area)
        })
        break
      }
      case 'enableDates':
        const dates = [
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`,
          `${year}-${month}-${this.generateRandomDate('date')}`
        ]
        calendar[action](dates)
        this.setData({
          rstStr: JSON.stringify(dates)
        })
        break
      case 'switchView':
        if (!this.week) {
          calendar[action]('week').then(calendarData => {
            console.log('switch success!', calendarData)
          })
          this.week = true
        } else {
          calendar[action]().then(calendarData => {
            console.log('switch success!', calendarData)
          })
          this.week = false
        }
        break
      case 'setSelectedDates':
        const toSet = [
          {
            year,
            month,
            date: this.generateRandomDate('date')
          },
          {
            year,
            month,
            date: this.generateRandomDate('date')
          }
        ]
        calendar[action](toSet)
        break
      case 'getCalendarDates':
        this.showToast('请在控制台查看结果')
        console.log(
          calendar.getCalendarDates({
            lunar: true
          })
        )
        break
      default:
        break
    }
  }
})