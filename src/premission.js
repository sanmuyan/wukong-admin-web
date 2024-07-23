import router, { personalRoutes, whiteList } from '@/router'
import store from '@/store'
import { ElMessage } from 'element-plus'
import { urlToParamsObj } from '@/utils/url'

// 处理登录后需要跳转的情况，比如 /login?redirect_uri=https://www.baidu.com 登录后会跳转到 https://www.baidu.com
const handleRedirect = () => {
  let redirectUri = ''
  if (window.location.search) {
    const searchObj = urlToParamsObj(window.location.href)
    if (searchObj.redirect_uri) {
      for (const k in searchObj) {
        if (k === 'redirect_uri') {
          redirectUri = searchObj[k]
        } else {
          if (redirectUri) {
            redirectUri += `&${k}=${searchObj[k]}`
          }
        }
      }
    }
  }
  if (redirectUri) {
    if (store.getters.token) {
      window.location.replace(redirectUri)
      return false
    }
    store.commit('login/setRedirectUri', redirectUri)
  } else {
    store.commit('login/removeRedirectUri')
  }
  return true
}

const removeRoutes = () => {
  router.getRoutes().forEach(item => {
    router.removeRoute(item.name)
  })
}

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    if (!handleRedirect()) {
      next()
    }
  }
  if (store.getters.token) {
    // 1. 用户登陆，则不允许进入 login
    if (to.path === '/login') {
      next('/')
    } else {
      // 判断用户信息是否存在，不存在则获取用户信息
      if (!store.getters.hasAccountProfile) {
        await store.dispatch('login/accountProfile')
        // 先移除原先的路由
        removeRoutes()
        // 添加用户个人路由
        personalRoutes.forEach(item => {
          router.addRoute(item)
        })
        // 处理用户权限，筛选出需要添加的权限
        const filterRoutes = await store.dispatch('permission/filterRoutes')
        // 利用 addRoute 循环添加
        filterRoutes.forEach(item => {
          router.addRoute(item)
        })
        // 添加完动态路由之后，需要在进行一次主动跳转
        // const search = window.location.search
        // if (search) {
        //   return next(to.path + search)
        // }
        return next(to.fullPath)
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
    if (whiteList.includes(to.path)) {
      next()
    } else {
      if (!whiteList.includes(from.path)) {
        ElMessage.error('未登录')
        store.commit('permission/setBackRoute', to.fullPath)
      }
      next('/login')
    }
  }
})
