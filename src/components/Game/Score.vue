<template>
  <div class="score"> 
    Votre score <span :class="animatedClass">{{ score }}</span>
  </div>
</template>

<script>
  export default {
    name: 'score',
    props: {
      score: Number
    },
    data () {
      return {
        animatedClass: ''
      }
    },
    watch: {
      score () {
        this.animatedClass = "animated bounceIn"        
        setTimeout( () => {
              this.animatedClass = ""
          }, 1000)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .score {    
    width: 200px;
    height: 40px;    
    background: #93C8CA;
    padding-left: 45px;
  }
  .score span {
    margin-left: 5px;
    font-size: 25px;
    font-weight: bold;
    position: relative;
    top: 2px;
  }
</style>