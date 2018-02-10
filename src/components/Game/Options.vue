<template> 
    <div class="options">
        <input type="checkbox" ref="wallOption" v-model="wallOption" @click="switchWallOption">
        <span>Authorizes the snake to go throw the walls</span>
    </div>
</template>

<script>
  export default {
    name: 'options',
    props: {
      optionNoWall: Boolean
    },
    data () {
      return {
        wallOption: this.optionNoWall
      }
    },
    methods: {
      /**
       * Emits the change of the option to the parent
       */
      switchWallOption () {
        // In order to lose the focus on the checkbox (to avoid the user to checking/unchecking it by pressing SPACE)
        this.$refs.wallOption.blur()
        // We update the option in the parent/game
        this.$emit('switchWallOption')
      }
    }
  }
</script>

<style scoped>
  .options {
    width: 520px;
    height: 30px;
    background: #090909;
    color: #b7b7b7;
    text-align: center;
    font-size: 14px;
    padding-top: 4px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    margin: auto;
  }
</style>