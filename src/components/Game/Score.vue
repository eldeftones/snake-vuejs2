<template>
  <div class="score"> 
    Votre score : {{ score }} 
  </div>
</template>

<script>
  export default {
    name: 'score',
    props: {
      score: Number
    }  
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .score {    
    width: 200px;
    height: 40px;
    padding-top: 8px;
    background: lightskyblue;
    text-align: center;
  }  
</style>