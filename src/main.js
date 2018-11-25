import Vue from 'vue'
import App from './App.vue'
import VueSimplemde from 'vue-simplemde'
import 'simplemde/dist/simplemde.min.css'

Vue.use(VueSimplemde)

new Vue({
  el: '#app',
  render: h => h(App)
})
