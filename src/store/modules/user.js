import { restFull } from '@/api'
import { getItem, removeItemAllItem, setItem } from '@/utils/storage'
import { TOKEN_KEY } from '@/constant'
import router from '@/router'
import store from '@/store'

export default {
  namespaced: true,
  state: () => ({
    token: getItem(TOKEN_KEY) || '',
    userProfile: {}
  }),
  mutations: {
    setToken (state, token) {
      state.token = token
      setItem(TOKEN_KEY, token)
    },
    setUserProfile (state, userProfile) {
      state.userProfile = userProfile
    }
  },
  actions: {
    login (context, token) {
      context.commit('setToken', token)
      router.push('/').then()
    },
    async userProfile (context) {
      const res = await restFull('/profile', 'GET')
      context.commit('setUserProfile', res)
    },
    logout (context) {
      context.commit('setToken', '')
      context.commit('setUserProfile', {})
      removeItemAllItem()
      store.getters.userRoutes.forEach(route => {
        router.removeRoute(route.name)
      })
      router.push('/login').then()
    }
  }
}
