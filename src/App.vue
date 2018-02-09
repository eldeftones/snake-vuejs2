<template>
  <div id="app">
    <snake :action="keyCode"></snake>
  </div>
</template>

<script>
  import Snake from './components/Game/Snake'

  export default {
    name: 'App',
    components: {
      Snake
    },
    data () {
      return {
        keyCode: ''                
      }
    },
    mounted () {
      // When the APP is loaded we listen for the Keydown events
      window.addEventListener('keydown', this.handleGlobalKeyDown)
    },
    destroyed () {
      window.removeEventListener('keydown', () => {})
    },
    methods: {
      handleGlobalKeyDown(e) {
        this.keyCode = e.keyCode
      }
    }
  }
</script>

<style>
  html {
    overflow: hidden;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>