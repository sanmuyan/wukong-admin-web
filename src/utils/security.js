import store from '@/store'
import { JSEncrypt } from 'jsencrypt'
import { ElMessage } from 'element-plus'

export const encryptClientData = async (data) => {
  if (!store.getters.clientEncryptPublicKey) {
    await store.dispatch('security/getClientEncryptPublicKey').then()
  }
  const encrypt = new JSEncrypt()
  try {
    encrypt.setPublicKey(atob(store.getters.clientEncryptPublicKey))
  } catch (e) {
    ElMessage.error('解析公钥失败')
    throw new Error('解析公钥失败')
  }
  const ciphertext = encrypt.encrypt(data)
  if (!ciphertext) {
    ElMessage.error('加密失败')
    throw new Error('加密失败')
  }
  return ciphertext
}
