<template>
  <div id="snakeBoard" class="snakeBoard">
	  	<div class="row" v-for="row in boardMatrix">
	      <square v-for="val in row" :key="row.id" :typeSquare="val" :headDirection="headDirection" :tailDirection="tailDirection" :colorSnake="colorSnake"></square>
	    </div>  

      <div class="showRules">
        <div class="rule">
            <img src="../../assets/apple24.png">
            <span>+1pts</span>
        </div><br>
        <div class="ruleTitle">            
            <span>Bonus (available for 5s) :</span>
        </div>
        <div class="rule">
            <img src="../../assets/strawberry24.png">
            <span>+5pts</span>
        </div>
        <div class="rule">
            <img src="../../assets/chili24.png">
            <span>+20pts but Max Speed for 10sec</span>
        </div>
        <div class="rule">
            <img src="../../assets/grapes24.png">
            <span>+30pts but inverted directions for 10sec</span>
        </div>
        <div class="rule">
            <img src="../../assets/trump24.png">
            <span>+30pts but a Wall is built for 30sec</span>
        </div>
    </div>
  </div>
</template>

<script>
  import Square from '../Game/Square'
  
  export default {
    name: 'board',
    components : {
    	Square
    },
    props: {
    	boardMatrix: Array,
    	gameRunning: Boolean,
      headDirection: Number,
      tailDirection: Number,
      colorSnake: String
    }
  }
</script>

<style scoped>
  .snakeBoard {
    width: 520px;
    height: 520px;
    margin: auto;
    background: #d5d5d5;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .row {
  	display:flex;
  	margin:0;
  	text-align:center;
   }
    .showRules {
    width: 340px;
    border: 1px solid black;
    border-radius:25px;
    padding: 20px 10px;
    position: relative;
    top: -350px;
    left: 440px;
    margin: auto;
  }
  .showRules img {
    position: relative;
    top: -3px;
  }
  .ruleTitle {
    text-align: center;
  }
</style>