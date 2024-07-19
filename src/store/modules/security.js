import { restFull } from '@/api'
import { CLIENT_ENCRYPT_PUBLIC_KEY } from '@/constant'
import { getSessionItem, removeSessionItem, setSessionItem } from '@/utils/storage'

export default {
  namespaced: true,
  state: () => ({
    clientEncryptPublicKey: getSessionItem(CLIENT_ENCRYPT_PUBLIC_KEY) || ''
  }),
  mutations: {
    setClientEncryptPublicKey (state, key) {
      state.clientEncryptPublicKey = key
      setSessionItem(CLIENT_ENCRYPT_PUBLIC_KEY, key)
    },
    removeClientEncryptPublicKey (state) {
      state.clientEncryptPublicKey = ''
      removeSessionItem(CLIENT_ENCRYPT_PUBLIC_KEY)
    }
  },
  actions: {
    async getClientEncryptPublicKey (context) {
      await restFull('/clientEncryptPublicKey', 'GET')
        .then(res => {
          context.commit('setClientEncryptPublicKey', res.data.public_key)
        })
    }
  }
}
