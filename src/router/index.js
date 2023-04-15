import { createRouter, createWebHashHistory } from 'vue-router'
import layout from '@/layout'
import user from './modules/user'

export const publicRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login')
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
      }
    ]
  }
]

export const privateRoutes = [
  user
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: publicRoutes
})

export default router
