import router from '@/router'
import store from '@/store'
import { ElMessage } from 'element-plus'

// 白名单
const whiteList = ['/login', '/oauth/callback']

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  if (store.getters.token) {
    // 1. 用户登陆，则不允许进入 login
    if (to.path === '/login') {
      next('/')
    } else {
      // 判断用户信息是否存在，不存在则获取用户信息
      if (!store.getters.hasUserProfile) {
        await store.dispatch('user/userProfile')
        // 处理用户权限，筛选出需要添加的权限
        const filterRoutes = await store.dispatch('permission/filterRoutes')
        // 利用 addRoute 循环添加
        filterRoutes.forEach(item => {
          router.addRoute(item)
        })
        // 添加完动态路由之后，需要在进行一次主动跳转
        const search = window.location.search
        if (search) {
          return next(to.path + search)
        }
        return next(to.path)
      }
      next()
    }
  } else {
    // 2. 用户未登录，只能进入白名单允许的页面
    // 处理第三方系统不能回调带#号的URL
    // const location = window.location
    // if (location.hash) {
    //   if (location.pathname === '/oauth/callback') {
    //     location.replace(location.origin + '/#/oauth/callback' + location.search)
    //     return
    //   }
    // }
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      if (whiteList.indexOf(from.path) === -1) {
        ElMessage.error('未登录')
      }
      next('/login')
    }
  }
})
