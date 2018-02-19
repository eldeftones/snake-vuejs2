<template> 
    <div class="animated startGame">
        Ready to play ?<br/>
        Press <span>SPACE</span>
    </div>
</template>

<script>
  export default {
    name: 'start-game-screen'
  }
</script>

<style scoped>
    .startGame {
      width: 230px;
      height: 80px;
      background: #848484;
      text-align: center;
      position: relative;
      top:-320px;
      margin:auto;
      border-radius: 50px;
      padding-top: 14px;
      color: white;
  }
  .startGame span {
    font-size: 20px;
    font-weight: bold;
  }
</style>