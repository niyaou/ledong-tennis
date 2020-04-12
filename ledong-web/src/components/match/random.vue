<template>
  <div class="component-container" style="height:200px">
   <div style="margin:10px;font-weight:600">  随机匹配</div>
     <button v-on:click="getScore" class="ui-button" style="margin-top:100px"  v-if="matchStatus===0"><span>开始匹配</span></button>
<div v-else-if="matchStatus===1" style="margin-top:100px" > 匹配中 。。。。。。</div>

  <div  v-else style="margin-top:100px" > 匹配成功 :{{matchId}} </div>
  </div>
</template>

<script>

export default {
  name: 'random',
  data () {
    return {
      matchs: [],
      matchId: '',
      matchStatus: 0
    }
  },
  mounted () {
    // this.getScore()
  },
  methods: {
    getScore () {
      let that = this
      this.matchStatus = 1
      this.$axios({
        method: 'post',
        url: 'http://106.54.80.211:8081/match/randomMatch',
        data: that.qs.stringify({
          courtGPS: '54.1,112.3'

        })
      })
        .then((res) => {
          //   if (res.data.code === 0) {
          // console.info(that.matchId, that.data.matchStatus)
          this.matchId = res.data.data
          this.matchStatus = res.data.data === null ? 0 : 2
          //   }
          console.info('res.data', res.data.data)
        }).catch(e => {
          // that.$router.push({name: 'index'})
          this.matchStatus = 0
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
