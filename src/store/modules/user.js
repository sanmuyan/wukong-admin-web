import { restFull } from '@/api'
import { getItem, removeItemAllItem, setItem } from '@/utils/storage'
import { TOKEN_KEY } from '@/constant'
import router from '@/router'

export default {
  namespaced: true,
  state: () => ({
    token: getItem(TOKEN_KEY) || '',
    userProfile: getItem('userProfile') || {}
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
      this.commit('user/setToken', token)
      router.push('/').then()
    },
    async userProfile (context) {
      const res = await restFull('/user/profile', 'GET')
      this.commit('user/setUserProfile', res)
    },
    logout () {
      this.commit('user/setToken', '')
      this.commit('user/setUserProfile', {})
      removeItemAllItem()
      router.push('/login').then()
    }
  }
}
