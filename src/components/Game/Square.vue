<template>
  <span class="square" :class="typeSquareClass"></span>
</template>

<script>
  export default {
    name: 'square',
    props: {
      typeSquare: Number, // 0 = Nothing / 1 = Snake / 2 = Food / 3 = Head / 4 = Tail
      headDirection: Number,
      tailDirection: Number
    },
    computed: {
      typeSquareClass () {
        if (this.typeSquare === 1){
          return 'snake'
        }
        if (this.typeSquare === 2){
          //return 'animated zoomIn food'
          return 'animated bounceInDown food'
        }
        if (this.typeSquare === 3){
          if (this.headDirection === 0)
            return 'snake toTheTop'
          if (this.headDirection === 1)
            return 'snake toTheRight'
          if (this.headDirection === 2)
            return 'snake toTheBottom'
          if (this.headDirection === 3)
            return 'snake toTheLeft'
        }
        if (this.typeSquare === 4){
          if (this.tailDirection === 0)
            return 'snake toTheBottom'
          if (this.tailDirection === 1)
            return 'snake toTheLeft'
          if (this.tailDirection === 2)
            return 'snake toTheTop'
          if (this.tailDirection === 3)
            return 'snake toTheRight'
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
    background: #1E913C;
  }
  .food {
    background: #212529;
    border-radius: 10px;
  }
  .toTheTop {
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
  }
  .toTheRight {
    border-top-right-radius: 40px;
    border-bottom-right-radius: 40px;
  }
  .toTheBottom {
    border-bottom-right-radius: 40px;
    border-bottom-left-radius: 40px;
  }
  .toTheLeft {
    border-top-left-radius: 40px;
    border-bottom-left-radius: 40px;
  }
</style>