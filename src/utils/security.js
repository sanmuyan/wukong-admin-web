import store from '@/store'
import { JSEncrypt } from 'jsencrypt'

export const encryptClientData = async (data) => {
  if (!store.getters.clientEncryptPublicKey) {
    await store.dispatch('security/getClientEncryptPublicKey').then()
  }
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(atob(store.getters.clientEncryptPublicKey))
  return encrypt.encrypt(data)
}
