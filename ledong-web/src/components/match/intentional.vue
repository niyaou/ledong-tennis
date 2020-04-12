<template>
  <div class="component-container" style="height:200px">
     <div style="margin:10px;font-weight:600">发布比赛</div>
    <form v-on:submit.prevent="submit()">
      <input placeholder="球场" maxlength="15" type="text" v-model="court" />
      <!-- <input placeholder="位置" maxlength="13" type="text" v-model="gps" /> -->
      <!-- <input placeholder="比赛时间" maxlength="13" type="text" v-model="time" /> -->
        <myDatepicker :date="startTime" :option="multiOption" :limit="limit" v-model="dataForm.createDate" ></myDatepicker>
      <button type="submit" class="ui-button">
        <span>发布比赛</span>
      </button>

    </form>

  </div>
</template>

<script>
import myDatepicker from 'vue-datepicker/vue-datepicker-es6.vue'

export default {
  name: 'intentional',
  data () {
    return {
      dataForm: {
        id: 0,
        num: '',
        name: '',
        desc: '',
        createDate: '',
        createBy: '',
        updateDate: '',
        updateBy: ''
      },
      startTime: { // 相当于变量
        time: ''
      },
      multiOption: {
        type: 'min',
        week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        // format:"YYYY-M-D HH:mm",
        format: 'YYYY-MM-DD HH:mm:ss',
        inputStyle: {
          'display': 'inline-block',
          'padding': '6px',
          'line-height': '22px',
          'width': '160px',
          'font-size': '16px',
          'border': '2px solid #fff',
          'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
          'border-radius': '2px',
          'color': '#5F5F5F',
          'margin': '0'
        },
        color: {
          header: '#35acff',
          headerText: '#fff'
        },
        buttons: {
          ok: '确定',
          cancel: '取消'
        },
        placeholder: '请选时间',
        dismissible: true
      },
      limit: [{
        type: 'weekday',
        available: [1, 2, 3, 4, 5, 6, 0]
      },
      {
        type: 'fromto',
        from: '2016-02-01',
        to: '2050-02-20'
      }],
      court: '',
      gps: '',
      time: ''
    }
  },
  components: { myDatepicker },
  mounted () {
    // this.getScore()
  },
  methods: {
    submit () {
      let that = this
      this.matchStatus = 1
      this.$axios({
        method: 'post',
        url: 'http://localhost:8081/match/intentionalMatch',
        data: that.qs.stringify({
          courtGPS: '54.1,112.3',
          courtName: that.court,
          orderTime: that.startTime.time
        })
      })
        .then(res => {
          console.info(res)
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
  margin: 30px;
  border-color: #42b983;
}
a {
  color: #42b983;
}
</style>
