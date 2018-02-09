<template> 
    <div class="animated restartGame">
        Restart the game ?<br/>
        Press <span>SPACE</span>
    </div>
</template>

<script>
  export default {
    name: 'restart-screen'
  }
</script>

<style scoped>
    .restartGame {
      width: 230px;
      height: 80px;
      background: #4449;    
      text-align: center;
      position: relative;
      top:-320px;
      margin:auto;
      border-radius: 50px;
      padding-top: 14px;
      color: white;
  }
  .restartGame span {
    font-size: 20px;
    font-weight: bold;
  }
</style>