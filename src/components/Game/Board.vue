<template>
  <div id="snakeBoard" class="snakeBoard">
	  	<div class="row" v-for="row in boardMatrix">
	      <square v-for="val in row" :key="row.id" :typeSquare="val" :headDirection="headDirection" :tailDirection="tailDirection"></square>
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
      tailDirection: Number
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
</style>