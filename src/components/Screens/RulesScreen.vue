<template>
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
</template>

<script>
  export default {
      name: 'rules'
  }
</script>

<style scoped>
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
