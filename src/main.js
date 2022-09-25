import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/font/iconfont.css'
import '@/plugins/element.js'
import axios from 'axios'
axios.defaults.baseURL='https://lianghj.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})
Vue.prototype.$https=axios





import '@/assets/css/reset.css'
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
