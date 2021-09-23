<template>
  <div id="app" class="container-fluid">
    <Header />
      <router-view />
  </div>
</template>

<script>
import Header from "./components/Header";

export default {
  components: {
    Header
  }
};
</script>

<style lang="scss">
body { 
  background: url('../src/assets/pattern.jpg');
}
.main { 
  position: absolute; 
  top: 0; 
  bottom: 0; 
  left: 0; 
  right: 0; 
  padding-top: 100px; 
}
</style>