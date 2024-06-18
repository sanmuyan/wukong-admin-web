import { restFull } from '@/api'
import { getItem, removeItem, removeItemAllItem, setItem } from '@/utils/storage'
import { LOGIN_CALLBACK, TOKEN_KEY } from '@/constant'
import router from '@/router'
import store from '@/store'
import { setCookie } from '@/utils/cookie'

export default {
  namespaced: true,
  state: () => ({
    token: getItem(TOKEN_KEY) || '',
    userProfile: {},
    loginCallback: getItem(LOGIN_CALLBACK) || ''
  }),
  mutations: {
    setToken (state, token) {
      state.token = token
      setItem(TOKEN_KEY, token)
      setCookie('Authorization', `Bearer ${token}`, 30)
    },
    setUserProfile (state, userProfile) {
      state.userProfile = userProfile
    },
    setLoginCallback (state, loginCallback) {
      state.loginCallback = loginCallback
      setItem(LOGIN_CALLBACK, loginCallback)
    }
  },
  actions: {
    async login (context, token) {
      context.commit('setToken', token)
      const newHref = store.getters.loginCallback
      if (newHref) {
        window.location.replace(newHref)
        await store.dispatch('user/removeLoginCallback')
      } else {
        const route = store.getters.backRoute || '/'
        await router.push(route)
        await store.dispatch('permission/setBackRoute', '')
      }
    },
    async newLoginCallback (context, newHref) {
      context.commit('setLoginCallback', newHref)
      setItem(LOGIN_CALLBACK, newHref)
    },
    async removeLoginCallback (context) {
      context.commit('setLoginCallback', '')
      removeItem(LOGIN_CALLBACK)
    },
    async userProfile (context) {
      const res = await restFull('/account/profile', 'GET')
      context.commit('setUserProfile', res)
    },
    async logout (context) {
      context.commit('setToken', '')
      context.commit('setUserProfile', {})
      removeItemAllItem()
      setCookie('Authorization', '', -1)
      router.push('/login').then()
    }
  }
}
