<template>
  <div class="hello">

    <button v-on:click="logout" class="ui-button">
      <span>退出</span>
    </button>
    <!-- <button v-on:click="validate" class="ui-button">
      <span>验证</span>
    </button> -->
    <div class="wt-flex-row">
      <detail style="width:30%" />
      <random style="width:30%" />
      <list style="width:30%" />
    </div>

    <div class="wt-flex-row">
      <active style="width:50%" />
      <dealing style="width:50%" />
    </div>

    <div class="wt-flex-row" style="margin-top:50px">
      <playing style="width:50%" />

      <result style="width:50%" />
    </div>

    <div class="wt-flex-row" style="margin-top:50px">
      <match-list style="width:50%" />

      <intentional style="width:50%" />
    </div>
  </div>
</template>

<script>
import router from '../router'
import detail from './rank/detail'
import list from './rank/list'
import matchList from './match/matchList'
import random from './match/random'
import intentional from './match/intentional'
import active from './match/active'
import dealing from './match/dealing'
import playing from './match/playing'
import result from './match/result'
export default {
  name: 'index',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    detail,
    list,
    matchList,
    random,
    intentional,
    active,
    dealing,
    playing,
    result
  },
  methods: {
    logout () {
      window.localStorage.removeItem('token')
      router.push({ name: 'register' })
      console.info('111111111111111')
    },
    validate () {
      this.$axios({
        method: 'get',
        // url: 'http://www.ledongtennis.cn/user/login',
        url: 'http://106.54.80.211:8081/user/validate'
      })
        .then(res => {
          // console.info(res)
        })
        .catch(e => {
          // that.$router.push({name: 'index'})
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
