import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import AlbumDetail from '../views/AlbumDetail.vue'
import SongDetail from '../views/SongDetail.vue'
import CreaterInfo from '../views/CreaterInfo.vue'
import AlbumList from '../views/AlbumList.vue'
import ReviewList from '../views/ReviewList.vue'
import { getUserId } from '../utils/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'CreaterInfo',
    component: CreaterInfo,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/albumList',
    name: 'AlbumList',
    component: AlbumList,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reviews',
    name: 'ReviewList',
    component: ReviewList,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/albumdetail/:id',
    name: 'AlbumDetail',
    component: AlbumDetail,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/songdetail/:id',
    name: 'SongDetail',
    component: SongDetail,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    var userId = getUserId()
    console.log('userId:' + userId)
    if (to.meta.requiresAuth && !userId) {
      next({
        path: '/login'
      })
    } else {
      next()
    }
  }
})
export default router
