import { createRouter, createWebHistory } from 'vue-router'
import layout from '@/layout'
import user from './modules/user'
import app from './modules/app'

export const publicRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/oauth/callback',
    component: () => import('@/views/login/components/OauthCallback')
  },
  {
    path: '/',
    redirect: '/profile',
    component: layout,
    children: [
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/profile'),
        meta: {
          title: 'profile',
          icon: 'dashboard'
        }
      },
      {
        path: '/404',
        name: '404',
        component: () => import('@/views/error/404')
      },
      {
        path: '/oauth/authorize',
        name: 'oauthAuthorize',
        component: () => import('@/views/login/components/OauthAuthorize')
      }
    ]
  }
]

export const privateRoutes = [
  user, app
]

const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes
})

export default router
