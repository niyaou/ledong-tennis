<template>
  <div class="hello .wt-flex">
    <div style="margin-top:30px">  登录 </div>
  <form v-on:submit.prevent="submit()" style="margin-top:30px">
    <input placeholder="账号" maxlength="15" type="text" v-model="user.name" />
    <input placeholder="密码" maxlength="13" type="password" v-model="user.psw" />

<button type="submit" class="ui-button" ><span>登录</span></button>
</form>
 <div class="divider div-transparent"></div>
     <div >  注册 </div>
  <form v-on:submit.prevent="register()" style="margin-top:30px" v-if="!registered">
    <input placeholder="账号" maxlength="15" type="text" v-model="user.rname" />
    <input placeholder="密码" maxlength="13" type="password" v-model="user.rpsw" />
  <!-- <input placeholder="昵称" maxlength="13" type="text" v-model="user.nickName" /> -->
<button type="submit" class="ui-button" ><span>注册</span></button>
</form>
<div v-else>注册成功</div>
  </div>
</template>

<script>
import router from '../router'

export default {
  name: 'register',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      registered: false,
      user: {
        name: '',
        psw: '',
        rname: '',
        rpsw: '',
        nickName: '111'

      }
    }
  },
  methods: {
    register () {
      let that = this
      this.$axios({
        method: 'post',
        // url: 'http://www.ledongtennis.cn/user/login',
        url: 'http://localhost:8081/user/register',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        data: {
          userName: this.user.rname,
          password: this.user.rpsw,
          phone: '12345678',
          clubMember: 0,
          nickName: this.user.nickName

        }
      })
        .then((res) => {
          if (res.data.code === 0) {
            that.registered = true
          }
        }).catch(e => {
          // that.$router.push({name: 'index'})
        })
    },
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

.div-transparent:before {
    content: "";
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    width: 80%;
    height: 1px;
    background-image: linear-gradient(to right, transparent, darkgrey, transparent);
}
.divider {
    position: relative;
    margin-top: 90px;
    height: 1px;
}
</style>
