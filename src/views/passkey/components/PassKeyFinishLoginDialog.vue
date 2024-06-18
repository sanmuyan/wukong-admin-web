<template>
  <el-dialog
    v-loading="loading"
    v-model="modelValue"
    width="350px"
    draggable
    title="确认通行密钥"
    center
    :show-close="false"
    :close-on-click-modal="false"
    @open="open"
    @close="closed">
  </el-dialog>
</template>

<script setup>
import { defineModel, inject, ref, watch } from 'vue'
import { base64ToUint8Array, uint8ArrayToBase64 } from '@/utils/encode'
import { restFull } from '@/api'
import { ElMessage } from 'element-plus'

const loading = ref(false)

// 父组件传入的值
const modelValue = defineModel({ required: true })
const beginLoginResponse = defineModel('passKeyBeginLoginResponse', { required: true })
const finishLoginDialogClosed = inject('passKeyFinishLoginDialogClosed')
const handleLoginData = inject('handleLoginData')

const handlePassKeyFinishLogin = async () => {
  const publicKey = beginLoginResponse.value.options.publicKey
  publicKey.challenge = base64ToUint8Array(publicKey.challenge)
  publicKey.allowCredentials.forEach(item => {
    item.id = base64ToUint8Array(item.id)
  })
  const credentialRequestOptions = {
    publicKey: publicKey
  }
  await navigator.credentials.get(credentialRequestOptions)
    .then(assertion => {
      if (!modelValue.value) {
        return
      }
      const authenticatorData = assertion.response.authenticatorData
      const clientDataJSON = assertion.response.clientDataJSON
      const rawId = assertion.rawId
      const signature = assertion.response.signature
      const userHandle = assertion.response.userHandle
      const assertionRequest = JSON.stringify({
        authenticatorAttachment: assertion.authenticatorAttachment,
        id: assertion.id,
        rawId: uint8ArrayToBase64(rawId),
        type: assertion.type,
        response: {
          authenticatorData: uint8ArrayToBase64(authenticatorData),
          clientDataJSON: uint8ArrayToBase64(clientDataJSON),
          signature: uint8ArrayToBase64(signature),
          userHandle: uint8ArrayToBase64(userHandle)
        }
      })
      restFull(`/passKeyFinishLogin?session_id=${beginLoginResponse.value.session_id}`, 'POST', assertionRequest)
        .then((data) => {
          handleLoginData(data)
        })
    })
    .catch(err => {
      ElMessage.error('操作已取消')
      console.log(err)
    })
  closed()
}

watch(
  () => modelValue.value,
  val => {
    if (val) {
      loading.value = true
      handlePassKeyFinishLogin()
    }
  })

const closed = () => {
  modelValue.value = false
  loading.value = false
  finishLoginDialogClosed()
}

</script>

<style scoped lang="scss">

</style>