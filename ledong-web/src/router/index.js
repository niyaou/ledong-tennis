import Vue from 'vue'
import Router from 'vue-router'
import index from '../components/index'
import register from '../components/register'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'index',
    component: index,
    meta: {
      requiresAuth: true
    }

  },
  {
    path: '/register',
    name: 'register',
    component: register,
    meta: {
      requiresAuth: false
    }
  }
]

const router = new Router({
  routes: routes
})

router.beforeEach((to, from, next) => {
  let token = window.localStorage.getItem('token')
  // console.info('token', token)
  // console.info('to', to.matched)
  if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
    console.info('  auth ', 1)
    next({
      path: '/register',
      query: { redirect: to.name }
    })
  } else {
    console.info('  auth ', 2)
    next()
  }
})

export default router
