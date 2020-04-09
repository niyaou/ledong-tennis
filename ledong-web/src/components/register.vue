<template>
  <div class="hello">
  <form v-on:submit.prevent="submit()">
    <input placeholder="账号" maxlength="15" type="text" v-model="user.name" />
    <input placeholder="密码" maxlength="13" type="password" v-model="user.psw" />

<button type="submit" class="ui-button" ><span>登录</span></button></form>
  </div>
</template>

<script>
import router from '../router'

export default {
  name: 'register',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      user: {
        name: '',
        psw: ''

      }
    }
  },
  methods: {
    submit () {
      // let that = this
      this.$axios({
        method: 'post',
        // url: 'http://www.ledongtennis.cn/user/login',
        url: 'http://localhost:8081/user/login',
        data: this.qs.stringify({
          userId: this.user.name,
          password: this.user.psw
        })
      })
        .then((res) => {
          if (res.data.code === 0) {
            window.localStorage.setItem('token', res.data.data)
            router.push({name: 'index'})
          }
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
