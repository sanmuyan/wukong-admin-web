// 专门处理权限路由的模块
import { privateRoutes, publicRoutes } from '@/router'
import store from '@/store'

export default {
  namespaced: true,
  state: {
    // 路由表：初始拥有静态路由权限
    routes: []
  },
  mutations: {
    /**
     * 增加路由
     */
    setRoutes (state, newRoutes) {
      // 永远在静态路由的基础上增加新路由
      state.routes = [...publicRoutes, ...newRoutes]
    }
  },
  actions: {
    /**
     * 根据权限筛选路由
     */
    filterRoutes (context) {
      const routes = []
      const menus = []
      const roles = store.getters.userProfile.rbac.roles
      if (roles) {
        roles.forEach(role => {
          if (role.access_level >= 100) {
            privateRoutes.forEach(route => {
              menus.push(route.name)
            })
          }
        })
      }
      // 路由权限匹配
      menus.forEach(key => {
        // 权限名 与 路由的 name 匹配
        routes.push(...privateRoutes.filter(item => item.name === key))
      })
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
