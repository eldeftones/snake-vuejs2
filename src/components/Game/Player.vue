<template>
  <div v-if="playerName != ''" class="player"> 
    Bienvenue <span class="animated flash">{{ playerName }}</span>
  </div>
</template>

<script>
  export default {
    name: 'player',
    props: {
      playerName: String
    } 
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .player {    
    width: 320px;
    height: 40px;
    padding-top: 8px;
    background: cadetblue;
    padding-left: 25px;
  }
  .player span {
    font-weight: bold;
  }
</style>