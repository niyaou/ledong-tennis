<template>
  <div class="component-container">
    <div style="margin:10px;font-weight:600">选手积分等级</div>
 <div>  name:{{name}}</div>
 <div>  score:{{score}}</div>
       <!-- <button v-on:click="getScore" class="ui-button" ><span>刷新</span></button> -->
  </div>
</template>

<script>
import eventBus from '../../main'
import constant from '../../utils/constant'
export default {
  name: 'detail',
  data () {
    return {
      name: 'Welcome to Your Vue.js App',
      score: ''
    }
  },
  mounted () {
    let that = this
    setInterval(function () {
      that.getScore()
    }, constant.REFRESH_INTERVAL_SLOW)
  },
  methods: {
    getScore () {
      let that = this

      this.$axios({
        method: 'get',
        url: 'http://106.54.80.211:8081/rank/rankInfo'
      })
        .then((res) => {
          // console.info(res)
          //   if (res.data.code === 0) {
          that.name = res.data.data.id
          that.score = res.data.data.score
          eventBus.$emit(constant.EVENT_USER_ID, res.data.data.id)

          //   }
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
