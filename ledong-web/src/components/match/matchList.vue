<template>
  <div class="component-container">
 <div style="margin:10px;font-weight:600">寻找对手的比赛列表</div>
<ul id="example-1" class="wt-flex">
  <li v-for="item in matchs" v-bind:key="item.id">
 <div> 发布者 : {{ item.holder }}      ||  挑战者 : {{ item.challenger }}        ||  场地 : {{ item.courtName}}    ||   时间 : {{ item.orderTime}} </div>
 <button v-on:click="challenge(item.id)" class="ui-button"   :disabled="item.holder === userId"><span>应战</span></button>
  </li>
</ul>
  <!-- <button v-on:click="getScore()" class="ui-button" ><span>刷新</span></button> -->
  </div>
</template>

<script>
import constant from '../../utils/constant'
import eventBus from '../../main'
export default {
  name: 'matchList',
  data () {
    return {
      matchs: [],
      userId: ''
    }
  },
  mounted () {
    // this.initList()
    let that = this
    setInterval(function () {
      that.getScore()
    }, 5000)
    eventBus.$on(constant.EVENT_USER_ID, userId => {
      this.userId = userId
      console.info('  event on :', userId)
    })
  },
  methods: {
    initList () {
      let that = this
      setInterval(function () {
        console.info('-----interval -------')
        that.getScore()
      }, constant.REFRESH_INTERVAL_FAST)
    },
    challenge (matchId) {
      this.$axios({
        method: 'post',
        url: `http://106.54.80.211:8081/match/intentionalMatch/${matchId}`
      })
        .then((res) => {

        }).catch(e => {

        })
      console.info(matchId)
    },
    getScore () {
      // let that = this

      this.$axios({
        method: 'get',
        url: 'http://106.54.80.211:8081/match/intentionalMatch/100'
      })
        .then((res) => {
          // console.info(res)
          //   if (res.data.code === 0) {
          this.matchs = res.data.data

          //   }
          // console.info(that.data.name)
        }).catch(e => {
          // that.$router.push({name: 'index'})
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
li {
  display: inline-block;
  margin: 30px;
  border-color:#42b983;
}
a {
  color: #42b983;
}
</style>
