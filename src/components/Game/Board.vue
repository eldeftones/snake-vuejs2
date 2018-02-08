<template>
  <div id="snakeBoard" class="snakeBoard">
	  	<div class="row" v-for="row in boardMatrix">
	      <square v-for="val in row" :key="row.id" :typeSquare="val"></square>
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
    	gameRunning: Boolean
    }
  }
</script>

<style scoped>
  .snakeBoard {
    width: 520px;
    height: 520px;
    margin: auto;
    background: lightgrey;
  }
  .row {
  	display:flex;
  	margin:0;
  	text-align:center;
   }
</style>