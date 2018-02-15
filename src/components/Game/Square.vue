<template>
  <span class="square" :class="typeSquareClass">
    <img v-if="typeSquare === 2" src="../../assets/apple24.png" class="foodImg">
    <img v-if="typeSquare === 5" src="../../assets/strawberry24.png" class="foodImg">
    <img v-if="typeSquare === 6" src="../../assets/chili24.png" class="foodImg">
    <img v-if="typeSquare === 7" src="../../assets/grapes24.png" class="foodImg">
    <img v-if="typeSquare === 8" src="../../assets/trump24.png" class="foodImg">
    <img v-if="typeSquare === 9" src="../../assets/brickwall20.png" class="foodImg">
  </span>
</template>

<script>
  export default {
    name: 'square',
    props: {
      typeSquare: Number, // 0 = Nothing / 1 = Snake / 2 = Food / 3 = Head / 4 = Tail / 5-6 = Bonus
      headDirection: Number,
      tailDirection: Number,
      colorSnake: String
    },
    computed: {
      typeSquareClass () {
        if (this.typeSquare === 1){
          return this.colorSnake
        }
        else if (this.typeSquare === 2){
          //return 'animated zoomIn food'
          return 'animated bounceInDown food'
        }
        else if (this.typeSquare === 3){
          if (this.headDirection === 0)
            return this.colorSnake + ' toTheTop'
          if (this.headDirection === 1)  
            return this.colorSnake + ' toTheRight'
          if (this.headDirection === 2)
            return this.colorSnake + ' toTheBottom'
          if (this.headDirection === 3)
            return this.colorSnake + ' toTheLeft'
        }
        else if (this.typeSquare === 4){
          if (this.tailDirection === 0)
            return this.colorSnake + ' toTheBottom'
          if (this.tailDirection === 1)
            return this.colorSnake + ' toTheLeft'
          if (this.tailDirection === 2)
            return this.colorSnake + ' toTheTop'
          if (this.tailDirection === 3)
            return this.colorSnake + ' toTheRight'
        }
        else if (this.typeSquare >= 5 && this.typeSquare != 9){
          return 'animated flash infinite'
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
  .green {
    background: #1E913C;
  }
  .red {
    background: #D73E3A;
  }
  .purple {
    background: #9777A8;
  }
  .foodImg {
    margin-top:-10px;
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