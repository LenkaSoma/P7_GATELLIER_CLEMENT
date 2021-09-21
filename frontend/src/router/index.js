import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
   {
      path: '/',
      name: 'Posts',
      component: () => import('../views/Posts.vue')
   },
   {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Register.vue')
   },
   {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
   },
   {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue')
   }
]
   
const router = new VueRouter({ routes })
export default router