import layout from '@/layout'
export default {
  path: '/settings',
  component: layout,
  name: 'settings',
  meta: {
    title: 'settings',
    icon: 'settings',
    singlePage: true
  },
  children: [
    {
      path: '/settings/',
      component: () => import('@/views/settings/settings.vue')
    }
  ]
}
