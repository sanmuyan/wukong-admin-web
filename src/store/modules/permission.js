// 专门处理权限路由的模块
import { privateRoutes } from '@/router'
import store from '@/store'

export default {
  namespaced: true,
  state: {
    // 保存用户路由表
    userRoutes: [],
    backRoute: ''
  },
  mutations: {
    /**
     * 增加路由
     */
    setRoutes (state, newRoutes) {
      // 增加新路由
      state.userRoutes = newRoutes
    },
    setBackRoute (state, route) {
      state.backRoute = route
    }
  },
  actions: {
    setBackRoute (context, route) {
      context.commit('setBackRoute', route)
    },
    /**
     * 根据权限筛选路由
     */
    filterRoutes (context) {
      const routes = []
      const menus = store.getters.userProfile.menus || []
      const accessLevel = store.getters.userProfile.access_level || 0
      if (accessLevel >= 100) {
        // 管理员
        privateRoutes.forEach(route => {
          routes.push(route)
        })
      } else {
        menus.forEach(menuName => {
          // 菜单名与路由的名称匹配
          routes.push(...privateRoutes.filter(route => route.name === menuName))
        })
      }
      // 最后添加 不匹配路由进入 404
      routes.push({
        path: '/:catchAll(.*)',
        redirect: '/404'
      })
      context.commit('setRoutes', routes)
      return routes
    }
  }
}
