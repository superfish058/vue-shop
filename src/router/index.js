import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Welcome from '@/views/Welcome.vue'
import Users from '@/views/Users.vue'
Vue.use(VueRouter)

const router = new VueRouter({
	routes: [{
			path: '/',
			redirect: '/login'
		},
		{
			path: '/login',
			component: Login
		},
		{
			path: '/home',
			component: Home,
			redirect: '/home/welcome',
			children: [{
					path: 'welcome',
					component: Welcome
				},
				{
					path: 'users',
					component: Users
				},
			]
		}
	]

})

router.beforeEach((to, from, next) => {
	if (to.path === '/login') {
		next()
	}
	const tokenStr = window.sessionStorage.getItem('token')
	if (!tokenStr) {
		next('/login')
	} else {
		next()
	}
})

export default router
