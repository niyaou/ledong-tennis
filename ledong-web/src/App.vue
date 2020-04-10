<template>
  <div id="app">
    <img src="./assets/ledong.png">
    <!-- <route-link to="index" >index</route-link>|
        <route-link to="register" >register</route-link> -->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.wt-flex {
     display: flex;
     justify-content: space-between;
     flex-direction: column;

 }

 .wt-flex-row {
     display: flex;
     justify-content: space-between;
     flex-direction: row;
     height: 100%;
     width:100%;
 }

 .component-container{
    margin: 10px;
  border-color:#272727;
  border-width: 1px;
  border-style: solid;
 }
 li {
  display: inline-block;
  margin: 5px;
  border-color:#42b983;
  border-width: 1px;
  border-style: solid;
}
</style>
