//index.js
//获取应用实例
const app = getApp()
var http = require('../../utils/http.js')
const chooseLocation = requirePlugin('chooseLocation');
Page({
    data: {
        versionName: '2.0.3',
        motto: 'Hello World',
        userInfo: {
            nickName: "请登录",
            avatarUrl: "../../icon/user2.png"
        },
        userLocation: {},
        userRankInfo: {
            rankType0: '暂无'
        },
        vsCode: '',
        matchCount: 0,
        nearByUser: [],
        rankPosition: 0,
        opponents: [],
        nearByCourt: [],
        tags: [],
        isSingle: true,
        hasUserInfo: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        statusBarHeight: getApp().globalData.statusBarHeight,
        totalBarHeight: getApp().globalData.totalBarHeight,
        ratio: getApp().globalData.ratio,
        tabBarStatus: 1, // 栏目标志位 0:技术统计， 1：比赛 ， 2：天梯,
        userList: []
    },
    //事件处理函数
    bindViewTap: function() {
        this.setData({
            hasUserInfo: false
        })
        return
    },

    // onShow:function(){
    //   console.log('on---show')
    //  this. getUserRankInfo(app.globalData.jwt)
    // },

    onLoad: function() {
        wx.showShareMenu({
            withShareTicket: true
        })
        let updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate((e) => {
            console.log(e)
            if (e.hasUpdate) {
                updateManager.applyUpdate()
            }
        })

        let that = this
        console.log('hasUserInfo', this.data.hasUserInfo, 'canIUse', this.data.canIUse)
        if (app.globalData.jwt) {
            this.getUserInfoByJwt(app.globalData.jwt)
            this.getUserRankInfo(app.globalData.jwt)
                // this.getRankPosition(app.globalData.jwt)
            this.gps()
        }
        // http.getReq(`user/userList`, app.globalData.jwt, (res) => {
        //   if (res.code == 0 && res.data != null) {
        //     // console.log('userlist',res.data)
        //     app.globalData.userList = res.data
        //     that.setData({
        //       userList: res.data
        //     })
        //   }
        // })
    },
    onShow: function() {
        console.log('----------show')
        let that = this
        if (app.globalData.jwt) {
            this.getUserInfoByJwt(app.globalData.jwt)
            this.getUserRankInfo(app.globalData.jwt)
                // this.getRankPosition(app.globalData.jwt)
            this.gps()
        }
    },
    checkingLogin() {
        return this.data.userInfo.nickName !== "请登录"
    },
    loginClick() {
        console.log('checkingLogin', this.checkingLogin())
        if (this.checkingLogin()) {
            console.log('checkingLogin   1', this.checkingLogin())
            return
        } else {
            console.log('checkingLogin  2', this.checkingLogin())
            this.setData({
                hasUserInfo: false
            })
        }
    },
    onConfirmEmitted() {
        console.log('-----onConfirmEmitted------')
    },
    onLocationTapped(e) {
        console.log(e)
        const key = 'YIGBZ-BKCRF-JI5JV-NZ6JF-A5ANT-LSF2T'; //使用在腾讯位置服务申请的key
        const referer = 'dd'; //调用插件的app的名称

        const location = JSON.stringify({
            latitude: e.detail[0].courtGPS ? e.detail[0].courtGPS.split(',')[0] : app.globalData.gps.split(',')[0],
            longitude: e.detail[0].courtGPS ? e.detail[0].courtGPS.split(',')[1] : app.globalData.gps.split(',')[1],
        });
        const category = '体育户外,体育场馆,';
        wx.navigateTo({
            url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`,
            success: function(res) {
                console.log(res)
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: res
                })
            }
        })
    },
    getTotalGames(jwt) {
        http.getReq('match/matchedGames/count', jwt, (e) => {
            this.setData({
                matchCount: e.data
            })
        })
    },
    getUserInfo: function(e) {
        app.globalData.userInfo = e.detail.userInfo
        console.log(e)
        this.setData({
            userInfo: e.detail.userInfo,
        })
        this.verified()
    },
    verified() {
        let that = this
        wx.login({
            success(res) {
                console.log(res)
                http.postReq('user/verified', '', {
                    token: res.code,
                }, function(e) {

                    that.setData({
                        vsCode: e.data
                    })
                    console.log('set vscode', e)
                })
            }
        })
    },
    login() {
        let that = this
        http.postReq('user/login', '', {
            token: that.data.openId,
            nickName: that.data.userInfo.nickName,
            avator: that.data.userInfo.avatarUrl,
            gps: `${that.data.userLocation.latitude},${that.data.userLocation.longitude}`
        }, function(e) {
            wx.setStorageSync('jwt', e.data)
            if (e.code == 0) {
                app.globalData.jwt = e.data
                wx.showLoading({
                    mask: true,
                    title: '加载中',
                })
                setTimeout(function() {
                    that.gps()
                    that.getUserInfoByJwt(e.data)
                    that.getUserRankInfo(e.data)
                        // that.getNearByCourt(app.globalData.jwt)
                        // that. getNearByUser(app.globalData.jwt)
                }, 1500)
            }
        })
    },
    getPhoneNumber(e) {
        let that = this
        console.log(e)
        http.postReq('user/phone', '', {
            vscode: this.data.vsCode,
            iv: e.detail.iv,
            data: e.detail.encryptedData,
        }, function(e) {
            let jsonData = JSON.parse(e.data)
            console.log(jsonData)
            if (e.code == 0) {
                that.setData({
                    openId: jsonData.purePhoneNumber,
                })
                that.login()
            }
        })
    },
    getUserInfoByJwt(jwt) {
        http.getReq('user/userinfo', jwt, (e) => {
            this.setData({
                userInfo: {
                    avatarUrl: e.data.avator,
                    nickName: e.data.nickName
                },
                hasUserInfo: true,

            })
            console.log('--------1------')
        })
    },
    getOpponentCount(jwt) {
        http.getReq('match/matchedGames/h2h/opponent', jwt, (e) => {
            console.log(e)
            this.setData({
                opponents: e.data
            })
        })
    },
    getRankPosition(jwt) {
        http.getReq('rank/rankPosition', jwt, (e) => {
            this.setData({
                rankPosition: e.data
            })
        })
    },
    getUserRankInfo(jwt) {
        http.getReq('rank/rankInfo', jwt, (e) => {
            console.log(e.data)
            let tags = []
            if (typeof e.data.polygen !== 'undefined' && e.data.polygen !== null) {
                tags = e.data.polygen.split(',')
            }
            if (tags[0] === '') {
                tags = tags.splice(1, tags.length)
            }
            this.setData({
                userRankInfo: {
                    rankType1: e.data.rankType1,
                    rankType0: e.data.rankType0,
                    doubleRankType1: e.data.doubleRankType1,
                    doubleRankType0: e.data.doubleRankType0,
                    winRate: e.data.winRate,
                    score: e.data.score,
                    doubleRankPosition: e.data.doublePosition,
                    doubleWinRate: e.data.doubleWinRate,
                    doubleScore: e.data.doubleScore,
                    tags: tags
                },
                rankPosition: e.data.position
            })

            app.globalData.userRankInfo = this.data.userRankInfo
            app.globalData.openId = e.data.openId
            this.getTotalGames(jwt)
            this.getOpponentCount(jwt)
        })
    },
    getNearByUser(jwt) {
        let that = this
        http.getReq(`user/nearby?gps=${this.data.userLocation.latitude},${this.data.userLocation.longitude}`, jwt, (e) => {
            that.setData({
                nearByUser: e.data.filter(u => {
                    return u.id !== app.globalData.openId
                })
            })
        })
    },
    getNearByCourt(jwt) {
        let that = this
        http.getReq(`match/court/nearby?gps=${this.data.userLocation.latitude},${this.data.userLocation.longitude}`, jwt, (e) => {
            that.setData({
                nearByCourt: e.data
            })
        })
    },
    gps() {
        let that = this
        wx.getLocation({
            type: 'wgs84',
            success(res) {
                that.setData({
                    userLocation: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    }
                })
                wx.setStorageSync('gps', `${res.latitude},${res.longitude}`)
                app.globalData.gps = `${res.latitude},${res.longitude}`
            }
        })

    },

    masterTap() {
        if (app.globalData.openId == '19960390361' || app.globalData.openId == '18602862619') {

            wx.navigateTo({
                url: '../master/master'
            })
        } else {}
    },
    switchMode() {
        this.setData({
            isSingle: !this.data.isSingle
        })
        var ladderComp = this.selectComponent('#ladder');
        if (ladderComp) {
            ladderComp.switchMode(this.data.isSingle)
        }
        var matchComp = this.selectComponent('#match');
        if (matchComp) {
            matchComp.switchMode(this.data.isSingle)
        }
    },
    masterNav(e) {
        console.log('master', e, app.globalData.openId)
        if (app.globalData.openId === "19960390361" || app.globalData.openId === "18602862619") {
            wx.navigateTo({
                url: '../../pages/master/player'
            })
        }
    },
    navigateTo(event) {
        console.log(event.currentTarget.dataset.variable)
        if (!this.checkingLogin()) {
            this.setData({
                hasUserInfo: false
            })
            return
        }
        if (event.currentTarget.dataset.variable === 0) {
            wx.navigateTo({
                url: '../../pages/matches/matchlist'
            })
        } else
        if (event.currentTarget.dataset.variable === 1) {
            wx.navigateTo({
                url: '../../pages/score/score'
            })
        } else
        if (event.currentTarget.dataset.variable === 2) {
            wx.navigateTo({
                url: '../../pages/player/player?rankPosition=' + this.data.rankPosition
            })
        } else
        if (event.currentTarget.dataset.variable === 3) {
            wx.navigateTo({
                url: '../../pages/h2h/h2h?winRate=' + this.data.userRankInfo.winRate
            })
        }
        // event.currentTarget.dataset.variable;
    },
})