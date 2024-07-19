<template>
  <el-dialog
    v-model="modelValue"
    width="350px"
    draggable
    title="注册通行密钥"
    :show-close="false"
    :close-on-click-modal="false"
    @close="closed">
    <div>创建通行密钥后，可通过通行密钥进行登录</div>
    <div v-if="disableButton" style="margin-top: 5px">正在注册通行密钥...</div>
    <template #footer>
      <el-button type="primary" size="small" @click="handleButtonCancel" :disabled="disableButton">取消</el-button>
      <el-button type="primary" size="small" @click="handleButtonSubmit" :disabled="disableButton">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineModel, ref } from 'vue'
import { restFull } from '@/api'
import { passKeyDecode, passKeyEncode } from '@/utils/encode'
import { ElMessage } from 'element-plus'
const disableButton = ref(false)

// 父组件传入的值
const modelValue = defineModel({ required: true })

const handleRegisterPassKey = async () => {
  await restFull('/account/passKeyBeginRegistration', 'GET')
    .then(async res => {
      const publicKey = res.data.options.publicKey
      const sessionId = res.data.session_id
      publicKey.challenge = passKeyDecode(publicKey.challenge)
      publicKey.user.id = passKeyDecode(publicKey.user.id)
      await navigator.credentials.create({ publicKey })
        .then(async credential => {
          if (!modelValue.value) {
            return
          }
          const rawId = credential.rawId
          const attestationObject = credential.response.attestationObject
          const clientDataJSON = credential.response.clientDataJSON
          const attestationResponse = JSON.stringify({
            id: credential.id,
            rawId: passKeyEncode(rawId),
            type: credential.type,
            response: {
              attestationObject: passKeyEncode(attestationObject),
              clientDataJSON: passKeyEncode(clientDataJSON)
            }
          })
          await restFull(`/account/passKeyFinishRegistration?session_id=${sessionId}`, 'POST', attestationResponse)
            .then(() => {
              ElMessage.success('注册成功')
            })
        })
        .catch(err => {
          ElMessage.error('操作已取消')
          console.log(err)
        })
    })
  closed()
}

const handleButtonSubmit = () => {
  handleRegisterPassKey()
  disableButton.value = true
}

const handleButtonCancel = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  disableButton.value = false
}

</script>

<style scoped lang="scss">

</style>
