<template>
  <div class="component-container">
 <div style="margin:10px;font-weight:600">选手排名表</div>
<ul id="example-1" class="wt-flex">
  <li v-for="item in ranks" v-bind:key="item.id">
 <div> name : {{ item.id }}     ||   score : {{ item.score}} </div>
 <button v-on:click="challenge(item.id)" class="ui-button" :disabled="item.id === userId"><span>挑战</span></button>
  </li>
</ul>

       <!-- <button v-on:click="getScore" class="ui-button" ><span>刷新</span></button> -->
  </div>
</template>

<script>
import constant from '../../utils/constant'
import eventBus from '../../main'
export default {
  name: 'list',
  data () {
    return {
      ranks: [],
      userId: ''
    }
  },
  mounted () {
    // this.getScore()
    let that = this
    setInterval(function () {
      that.getScore()
    }, constant.REFRESH_INTERVAL_SLOW)

    eventBus.$on(constant.EVENT_USER_ID, userId => {
      this.userId = userId
      console.info('  event on :', userId)
    })
  },
  methods: {
    challenge (holder) {
      this.$axios({
        method: 'post',

        url: `http://106.54.80.211:8081/match/challengeMatch/${holder}`

      })
        .then((res) => {

        }).catch(e => {

        })
    },
    getScore () {
      // let that = this

      this.$axios({
        method: 'get',
        url: 'http://106.54.80.211:8081/rank/rankList'
      })
        .then((res) => {
          // console.info(res)
          this.ranks = res.data.data
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

a {
  color: #42b983;
}
</style>
