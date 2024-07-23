import layout from '@/layout'
const menuSubIcon = 'menu-sub'
export default {
  path: '/user',
  component: layout,
  name: 'user',
  meta: {
    title: 'user',
    icon: 'personnel'
  },
  children: [
    {
      path: '/user/',
      component: () => import('@/views/user/user'),
      name: 'userManage',
      meta: {
        title: 'userManage',
        icon: menuSubIcon
      }
    },
    {
      path: '/group',
      component: () => import('@/views/user/group'),
      name: 'groupManage',
      meta: {
        title: 'groupManage',
        icon: menuSubIcon
      }
    }
  ]
}
