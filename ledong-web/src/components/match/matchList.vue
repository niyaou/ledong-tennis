<template>
  <div class="component-container">
已发布比赛列表
<ul id="example-1" class="wt-flex">
  <li v-for="item in matchs" v-bind:key="item.id">
 <div> 发布者 : {{ item.holder }}      ||  挑战者 : {{ item.challenger }}        ||  场地 : {{ item.courtName}}    ||   时间 : {{ item.orderTime}} </div>
  </li>
</ul>
  <button v-on:click="getScore" class="ui-button" ><span>刷新</span></button>
  </div>
</template>

<script>

export default {
  name: 'matchList',
  data () {
    return {
      matchs: []
    }
  },
  mounted () {
    this.getScore()
  },
  methods: {
    getScore () {
      let that = this

      this.$axios({
        method: 'get',
        url: 'http://localhost:8081/match/intentionalMatch/100'
      })
        .then((res) => {
          console.info(res)
          //   if (res.data.code === 0) {
          console.info(res)
          this.matchs = res.data.data

          //   }
          console.info(that.data.name)
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
