import { restFull } from '@/api'
import { CLIENT_ENCRYPT_PUBLIC_KEY } from '@/constant'
import { getCookie, setCookie } from '@/utils/cookie'

export default {
  namespaced: true,
  state: () => ({
    clientEncryptPublicKey: getCookie(CLIENT_ENCRYPT_PUBLIC_KEY) || ''
  }),
  mutations: {
    setClientEncryptPublicKey (state, key) {
      state.clientEncryptPublicKey = key
      setCookie(CLIENT_ENCRYPT_PUBLIC_KEY, key, null)
    }
  },
  actions: {
    async getClientEncryptPublicKey (context) {
      const res = await restFull('/clientEncryptPublicKey', 'GET')
      context.commit('setClientEncryptPublicKey', res.public_key)
    }
  }
}
