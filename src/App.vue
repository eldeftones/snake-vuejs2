<template>
  <div id="app">
    <snake :action="keyCode"></snake>

     <div class="freeIcons">Icons made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
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
    margin-top: 60px;
  }
  .freeIcons {
    font-size: 12px;
    text-align: right;
    position: absolute;
    bottom: 0;
  }
</style>