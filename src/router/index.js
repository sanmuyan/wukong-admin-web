import { createRouter, createWebHistory } from 'vue-router'
import user from './modules/user'
import app from './modules/app'
import { publicRoutes } from '@/router/modules/public'
import home from './modules/home'

export const privateRoutes = [
  user, app
]

export const personalRoutes = [
  home
]

const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes
})

export default router

// 路由守卫白名单
export const whiteList = ['/login', '/oauth/callback']
