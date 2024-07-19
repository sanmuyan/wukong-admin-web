import { restFull } from '@/api'
import { getLocalItem, removeAllLocalItem, removeAllSessionItem, removeLocalItem, setLocalItem } from '@/utils/storage'
import { REMEMBER_LOGIN, TOKEN_KEY } from '@/constant'
import router from '@/router'
import store from '@/store'
import { getCookie, removeAllCookie, removeCookie, setCookie } from '@/utils/cookie'

export default {
  namespaced: true,
  state: () => ({
    token: getCookie(TOKEN_KEY) || '',
    accountProfile: {},
    redirectUri: '',
    rememberLogin: getLocalItem(REMEMBER_LOGIN) || false
  }),
  mutations: {
    setToken (state, token) {
      state.token = token
      setCookie(TOKEN_KEY, `Bearer ${token}`, state.rememberLogin ? 365 : 0)
    },
    removeToken (state) {
      state.token = ''
      removeCookie(TOKEN_KEY)
    },
    setAccountProfile (state, accountProfile) {
      state.accountProfile = accountProfile
    },
    removeAccountProfile (state) {
      state.accountProfile = {}
    },
    setRedirectUri (state, redirectUri) {
      state.redirectUri = redirectUri
    },
    removeRedirectUri (state) {
      state.redirectUri = ''
    },
    setRememberLogin (state, rememberLogin) {
      state.rememberLogin = rememberLogin
      setLocalItem(REMEMBER_LOGIN, rememberLogin)
    },
    removeRememberLogin (state) {
      state.rememberLogin = false
      removeLocalItem(REMEMBER_LOGIN)
    }
  },
  actions: {
    async login (context, token) {
      context.commit('setToken', token)
      const redirectUri = context.state.redirectUri
      if (redirectUri) {
        window.location.replace(redirectUri)
        context.commit('removeRedirectUri')
      } else {
        const route = store.getters.backRoute || '/'
        await router.push(route)
        store.commit('permission/removeBackRoute')
      }
    },
    async accountProfile (context) {
      await restFull('/account/profile', 'GET')
        .then(res => {
          context.commit('setAccountProfile', res.data)
        })
    },
    async logout (context) {
      context.commit('removeToken')
      context.commit('removeAccountProfile')
      context.commit('removeRememberLogin')
      store.commit('security/removeClientEncryptPublicKey')
      removeAllLocalItem()
      removeAllSessionItem()
      removeAllCookie()
      router.push('/login').then()
    }
  }
}
