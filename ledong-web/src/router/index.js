import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// })

const routes = [
  {
    path: '/',
    component: require('../components/index'),
    meta: {
      requiresAuth: true
    }
  }
]

const router = new Router({
  routes: routes
})

router.beforeEach((to, from, next) => {
  let token = window.localStorage.getItem('token')

  if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {
    console.info('  auth ', 1)
    next({
      path: '../components/login',
      query: { redirect: to.fullPath }
    })
  } else {
    console.info('  auth ', 2)
    next()
  }
})

export default router
