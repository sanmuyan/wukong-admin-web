export const publicRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/login')
  },
  {
    path: '/oauth/callback',
    component: () => import('@/views/login/login')
  }
]
