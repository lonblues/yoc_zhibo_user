import Vue from 'vue'
import Router from 'vue-router'
// import { getUserId } from '../utils/store'
const Project = () => import('@/pages/results/ProjectList')
const Account = () => import('@/pages/results/AccountList')
const Award = () => import('@/pages/results/AwardList')
const Index = () => import('@/pages/index.vue')
const toPDF = () => import('@/pages/results/toPDF.vue')
const teamPDF = () => import('@/pages/results/teamPDF.vue')

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/project'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: '/project',
          name: 'project',
          component: Project
        },
        {
          path: '/account/:id',
          name: 'account',
          component: Account
        },
        {
          path: '/award/:id/:code',
          name: 'award',
          component: Award
        }
      ]
    },
    {
      path: '/topdf',
      name: 'toPDF',
      component: toPDF
    },
    {
      path: '/teampdf',
      name: 'teamPDF',
      component: teamPDF
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
