<template>
  <div id="app">
    <snake :action="keyCode"></snake>
  </div>
</template>

<script>
  import Snake from './components/Game/Snake'

  /**
    * Polyfill : In order to work with IE (because the JS fill() methods doen't work on it...)
    */
  if (!Array.prototype.fill) {  Object.defineProperty(Array.prototype, 'fill', {    value: function(value) {        console.log("POYLFILL CALLED")        if (this == null) {          throw new TypeError('this is null or not defined');        }        var O = Object(this);        var len = O.length >>> 0;        var start = arguments[1];        var relativeStart = start >> 0;        var k = relativeStart < 0 ?          Math.max(len + relativeStart, 0) :          Math.min(relativeStart, len);        var end = arguments[2];        var relativeEnd = end === undefined ?          len : end >> 0;        var final = relativeEnd < 0 ?          Math.max(len + relativeEnd, 0) :          Math.min(relativeEnd, len);        while (k < final) {          O[k] = value;          k++;        }        return O;      }    });  }

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