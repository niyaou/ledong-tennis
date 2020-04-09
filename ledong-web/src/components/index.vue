<template>
  <div class="hello">
    index
    <button v-on:click="logout" class="ui-button" ><span>退出</span></button>
      <button v-on:click="validate" class="ui-button" ><span>验证</span></button>
        <detail/>
        <list />
        <match-list />
        <random />
           <intentional />
  </div>

</template>

<script>
import router from '../router'
import detail from './rank/detail'
import list from './rank/list'
import matchList from './match/matchList'
import random from './match/random'
import intentional from './match/intentional'
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
    intentional
  },
  methods: {
    logout () {
      window.localStorage.removeItem('token')
      router.push({name: 'register'})
      console.info('111111111111111')
    },
    validate () {
      this.$axios({
        method: 'get',
        // url: 'http://www.ledongtennis.cn/user/login',
        url: 'http://localhost:8081/user/validate'

      })
        .then((res) => {
          console.info(res)
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
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
