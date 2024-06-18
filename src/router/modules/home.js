import layout from '@/layout'
const menuSubIcon = 'menu-sub'
export default {
  path: '/',
  component: layout,
  redirect: '/account/profile',
  name: 'home',
  meta: {
    title: 'home',
    icon: 'dashboard'
  },
  children: [
    {
      path: '/account/profile',
      name: 'profileManage',
      component: () => import('@/views/home/profile.vue'),
      meta: {
        title: 'profileManage',
        icon: menuSubIcon
      }
    },
    {
      path: '/account/security',
      name: 'securityManage',
      component: () => import('@/views/home/security.vue'),
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
