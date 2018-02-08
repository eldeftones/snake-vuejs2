<template>
  <span class="square" :class="typeSquareClass"></span>
</template>

<script>
  export default {
    name: 'square',
    props: {
      typeSquare: Number // 0 = Nothing / 1 = Snake / 2 = food
    },
    computed: {
      typeSquareClass () {
        if (this.typeSquare === 1){
          return 'snake'
        }
        if (this.typeSquare === 2){
          return 'food'
        }
      }
    }
  }
</script>

<style scoped>
  .square {
    height: 20px;
    width: 20px;
    padding: 0px;
    margin: 0px;
  }
  .snake {
    background: green;
  }
  .food {
    background: black;
  }
</style>