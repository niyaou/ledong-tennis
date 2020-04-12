<template>
  <div class="component-container">
 <div style="margin:10px;font-weight:600">比赛结果</div>
<div  class="wt-flex">
    {{matchId}}
 <div> 发布者 : {{ matchs.holder }}      ||  挑战者 : {{ matchs.challenger }}        ||  场地 : {{ matchs.courtName}}    ||   时间 : {{ matchs.orderTime}}
   </div>

  <div> {{ matchs.holder }}   :{{matchs.holderScore}}   ||   {{ matchs.challenger }}   :     {{ matchs.challengerScore}}
     </div>

     <div>{{message}}</div>

</div>
<div  class="wt-flex-row" style="height:50%;overflow-y:scroll">
<ul  class="wt-flex" style="height:50%;" >
  <li v-for="item in holderContext"   v-bind:key="item.id">
 <div class="li-holder">  {{ matchs.holder }}    :  {{ item.context}} </div>
  </li>
</ul>
<ul  class="wt-flex">
  <li v-for="item in challengerContext" v-bind:key="item.id"  >
 <div  class="li-challenger">  {{ matchs.challenger }}   : {{ item.context}} </div>
  </li>
</ul>
</div>
  <!-- <form v-on:submit.prevent="submit()">
    <input placeholder="请输入协商内容。。。" maxlength="30" type="text" v-model="message" style="width:80%" />

<button type="submit" class="ui-button" ><span>发送</span></button></form> -->
  </div>
</template>

<script>
import myDatepicker from 'vue-datepicker/vue-datepicker-es6.vue'
import constant from '../../utils/constant'
import eventBus from '../../main'

export default {
  name: 'result',
  data () {
    return {
      message: '',
      userId: '',
      matchs: {},
      matchId: '',
      holderContext: [],
      challengerContext: [],
      court: '',
      gps: '',
      time: '',
      disabled: false,
      courtName: '',
      dataForm: {
        id: 0,
        num: '',
        name: '',
        desc: '',
        createDate: '',
        createBy: '',
        updateDate: '',
        updateBy: ''
      },
      startTime: { // 相当于变量
        time: ''
      },
      multiOption: {
        type: 'min',
        week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        // format:"YYYY-M-D HH:mm",
        format: 'YYYY-MM-DD HH:mm:ss',
        inputStyle: {
          'display': 'inline-block',
          'padding': '6px',
          'line-height': '22px',
          'width': '160px',
          'font-size': '16px',
          'border': '2px solid #fff',
          'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
          'border-radius': '2px',
          'color': '#5F5F5F',
          'margin': '0'
        },
        color: {
          header: '#35acff',
          headerText: '#fff'
        },
        buttons: {
          ok: '确定',
          cancel: '取消'
        },
        placeholder: '请选时间',
        dismissible: true
      },
      limit: [{
        type: 'weekday',
        available: [1, 2, 3, 4, 5, 6, 0]
      },
      {
        type: 'fromto',
        from: '2016-02-01',
        to: '2050-02-20'
      }]
    }
  },
  components: { myDatepicker },
  mounted () {
    // this.initList()
    let that = this
    // eventBus.$on(constant.EVENT_DEALING_MATCH, matchId => {
    //   this.matchId = matchId
    //   console.info('  event on :', matchId)
    //   this.holderContext = []
    //   this.challengerContext = []
    //   this.getMatchInfo()
    //   // setInterval(function () {
    //   //   that.getSessionInfo()
    //   // }, 2000)

    setInterval(function () {
      that.getMatchInfo()
      that.lastResult()
    }, constant.REFRESH_INTERVAL_SLOW)

    eventBus.$on(constant.EVENT_USER_ID, userId => {
      this.userId = userId
      console.info('  event on :', userId)
    })
  },
  methods: {

    lastResult () {
      this.$axios({
        method: 'get',

        url: `http://localhost:8081/match/matchResult/`

      })
        .then((res) => {
          this.matchId = res.data.data.id
          // setTimeout(function () {
          //   that.getSessionInfo()
          //   console.info('-------refresh session--------')
          // }, 1000)
        }).catch(e => {
          // that.$router.push({name: 'index'})
        })
    },
    initList () {
      // let that = this
      setInterval(function () {
        console.info('-----interval -------')
      }, 4000)
    },
    getSessionInfo () {
      let that = this
      let holderCount = this.holderContext.length
      let challengerCount = this.challengerContext.length
      // 20200328224429-jerry-niyaou
      this.$axios({
        method: 'get',
        url: `http://localhost:8081/match/sessionContext/${this.matchs.sessionId}?holderCount=${holderCount}&challengerCount=${challengerCount}`
        // url: `http://localhost:8081/match/sessionContext/srTBNnEB-AzPenbiXM6x?holderCount=${holderCount}&challengerCount=${challengerCount}`
      })
        .then((res) => {
          if (res.data.data.holderContext != null) {
            that.holderContext = res.data.data.holderContext.concat(that.holderContext)
          }

          if (res.data.data.challengerContext != null) {
            that.challengerContext = res.data.data.challengerContext.concat(that.challengerContext)
          }
        }).catch(e => {
          // that.$router.push({name: 'index'})
        })
    },
    getMatchInfo () {
      // let that = this
      let type = this.userId === this.matchs.holder ? 0 : 1
      switch (type) {
        case 0:
          this.disabled = this.matchs.holderAcknowledged === 1001
          break
        case 1:
          this.disabled = this.matchs.challengerAcknowledged === 1001
          break
      }
      console.info(' this.disabled', this.disabled)
      this.$axios({
        method: 'get',
        url: `http://localhost:8081/match/matchInfo/${this.matchId}`
      })
        .then((res) => {
          // console.info(res)
          if (res.data.data != null) {
            this.matchs = res.data.data
            this.getSessionInfo()
            this.message = this.matchs.holder === this.userId ? this.matchs.winner === 5000 ? '胜利' : '失败' : this.matchs.winner === 5001 ? '胜利' : '失败'
            console.info(' this.message', this.message)
          }
        }).catch(e => {
          // that.$router.push({name: 'index'})
        })
    }

  },
  computed: {
    newTime () {
      return this.startTime.time
    }
  },
  watch: {
    newTime (val) {
      console.info(val)
      this.time = val

      this.$axios({
        method: 'post',
        url: `http://localhost:8081/match/matchInfo/${this.matchId}`,
        data: this.qs.stringify({
          orderTime: val
        })
      })
        .then((res) => {
        }).catch(e => {
        })
    },
    courtName (val) {
      console.info(val)
      this.$axios({
        method: 'post',
        url: `http://localhost:8081/match/matchInfo/${this.matchId}`,
        data: this.qs.stringify({
          courtName: val
        })
      })
        .then((res) => {
        }).catch(e => {
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}

.li-holder {
  display: inline-block;
  margin: 10px;
  color:#2e2e2e;
  background:#cdf5d6;

}

.li-challenger {
  display: inline-block;
  margin: 10px;
color:#2e2e2e;
  background:#11c738;

}

a {
  color: #42b983;
}
</style>
