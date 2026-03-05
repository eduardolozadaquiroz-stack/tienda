<template>
  <div id="app">
   <!-- <Sidebar /> -->
   <notifications group="foo" />
   <TourApp />
    <router-view/>
  </div>
</template>


<script>

import Sidebar from '@/components/Sidebar.vue';
import TourApp from '@/components/TourApp.vue';


export default {
    components: {
      Sidebar,
      TourApp
    }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh !important;
}
a{
  color: #6e84a3 !important;
}
</style>
