import layout from '@/layout'
const menuSubIcon = 'menu-sub'
export default {
  path: '/',
  component: layout,
  redirect: '/profile',
  name: 'profile',
  meta: {
    title: 'profile',
    icon: 'dashboard'
  },
  children: [
    {
      path: '/profile',
      name: 'profileManage',
      component: () => import('@/views/profile/profile'),
      meta: {
        title: 'profileManage',
        icon: menuSubIcon
      }
    },
    {
      path: '/security',
      name: 'securityManage',
      component: () => import('@/views/profile/security'),
      meta: {
        title: 'securityManage',
        icon: menuSubIcon
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
      component: () => import('@/views/app/components/OauthAuthorize')
    }
  ]
}
