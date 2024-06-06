import layout from '@/layout'
const menuSubIcon = 'menu-sub'
export default {
  path: '/app',
  component: layout,
  name: 'app',
  meta: {
    title: 'app',
    icon: 'app'
  },
  children: [
    {
      path: '/app/oauth',
      component: () => import('@/views/app/oauth'),
      name: 'oauthManage',
      meta: {
        title: 'oauthManage',
        icon: menuSubIcon
      }
    }
  ]
}
