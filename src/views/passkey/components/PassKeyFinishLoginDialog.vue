<template>
  <el-dialog
    v-loading="loading"
    v-model="modelValue"
    width="350px"
    draggable
    title="正在确认通行密钥..."
    center
    :show-close="false"
    :close-on-click-modal="false"
    @close="closed">
  </el-dialog>
</template>

<script setup>
import { defineModel, inject, ref, watch } from 'vue'
import { passKeyDecode, passKeyEncode } from '@/utils/encode'
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
  publicKey.challenge = passKeyDecode(publicKey.challenge)
  publicKey.allowCredentials.forEach(item => {
    item.id = passKeyDecode(item.id)
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
        rawId: passKeyEncode(rawId),
        type: assertion.type,
        response: {
          authenticatorData: passKeyEncode(authenticatorData),
          clientDataJSON: passKeyEncode(clientDataJSON),
          signature: passKeyEncode(signature),
          userHandle: passKeyEncode(userHandle)
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
