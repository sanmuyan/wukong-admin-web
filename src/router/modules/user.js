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
      path: '/role',
      component: () => import('@/views/user/role'),
      name: 'roleManage',
      meta: {
        title: 'roleManage',
        icon: menuSubIcon
      }
    },
    {
      path: '/resource',
      component: () => import('@/views/user/resource'),
      name: 'resourceManage',
      meta: {
        title: 'resourceManage',
        icon: menuSubIcon
      }
    }
  ]
}
