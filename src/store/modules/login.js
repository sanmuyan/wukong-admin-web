import { restFull } from '@/api'
import { getItem, removeItem, removeItemAllItem, setItem } from '@/utils/storage'
import { LOGIN_CALLBACK, TOKEN_KEY } from '@/constant'
import router from '@/router'
import store from '@/store'
import { getCookie, setCookie } from '@/utils/cookie'

export default {
  namespaced: true,
  state: () => ({
    token: getCookie(TOKEN_KEY) || '',
    accountProfile: {},
    loginCallback: getItem(LOGIN_CALLBACK) || ''
  }),
  mutations: {
    setToken (state, token) {
      state.token = token
      setCookie(TOKEN_KEY, `Bearer ${token}`, 365)
    },
    setAccountProfile (state, accountProfile) {
      state.accountProfile = accountProfile
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
        await store.dispatch('login/removeLoginCallback')
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
    async accountProfile (context) {
      const res = await restFull('/account/profile', 'GET')
      context.commit('setAccountProfile', res)
    },
    async logout (context) {
      context.commit('setToken', '')
      context.commit('setAccountProfile', {})
      removeItemAllItem()
      setCookie('Authorization', '', -1)
      router.push('/login').then()
    }
  }
}
