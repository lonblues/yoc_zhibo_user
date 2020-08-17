import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import VueTagsInput from '@johmun/vue-tags-input'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css'
import store from './store'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueTagsInput)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
