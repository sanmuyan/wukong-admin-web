import layout from '@/layout'
const menuSubIcon = 'menu-sub'
export default {
  path: '/rbac',
  component: layout,
  name: 'rbac',
  meta: {
    title: 'rbac',
    icon: 'rbac'
  },
  children: [
    {
      path: '/role',
      component: () => import('@/views/rbac/role.vue'),
      name: 'roleManage',
      meta: {
        title: 'roleManage',
        icon: menuSubIcon
      }
    },
    {
      path: '/resource',
      component: () => import('@/views/rbac/resource.vue'),
      name: 'resourceManage',
      meta: {
        title: 'resourceManage',
        icon: menuSubIcon
      }
    }
  ]
}
