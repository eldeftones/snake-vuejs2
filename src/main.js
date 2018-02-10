// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/**
* Polyfill : In order to work with IE (because the JS fill() methods doen't work on it...)
*/
Array.prototype.fill||Object.defineProperty(Array.prototype,"fill",{value:function(t){if(null==this)throw new TypeError("this is null or not defined");for(var r=Object(this),e=r.length>>>0,i=arguments[1]>>0,n=i<0?Math.max(e+i,0):Math.min(i,e),o=arguments[2],a=void 0===o?e:o>>0,l=a<0?Math.max(e+a,0):Math.min(a,e);n<l;)r[n]=t,n++;return r}});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})