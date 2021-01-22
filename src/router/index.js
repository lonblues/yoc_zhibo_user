import Vue from 'vue'
import Router from 'vue-router'
import Demo from '../pages/demo.vue'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  routes: [
    {
      path: '/',
      component: Demo
    }
  ]
})
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     next()
//   } else {
//     var userId = getUserId()
//     console.log('userId:' + userId)
//     if (to.meta.requiresAuth && !userId) {
//       next({
//         path: '/login'
//       })
//     } else {
//       next()
//     }
//   }
// })
export default router
