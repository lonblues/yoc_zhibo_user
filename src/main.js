import Vue from 'vue'
import ElementUI from 'element-ui'
import VueTagsInput from '@johmun/vue-tags-input'

import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueTagsInput)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
