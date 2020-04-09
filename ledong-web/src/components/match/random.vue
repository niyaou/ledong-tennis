<template>
  <div class="component-container" style="height:200px">

  <button v-on:click="getScore" class="ui-button" style="margin-top:100px" ><span>开始匹配</span></button>
  </div>
</template>

<script>

export default {
  name: 'random',
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
