<template>
  <el-dialog v-model="modelValue" width="350px" draggable title="注册通行密钥" @close="closed">
    创建通行密钥后，可通过通行密钥进行登录
    <template #footer>
      <el-button type="primary" size="small" @click="handleButtonCancel">取消</el-button>
      <el-button type="primary" size="small" @click="handleButtonSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineModel } from 'vue'
import { restFull } from '@/api'
import { base64ToUint8Array, uint8ArrayToBase64 } from '@/utils/encode'
import { ElMessage } from 'element-plus'

// 父组件传入的值
const modelValue = defineModel({ required: true })

const handleRegistrationPassKey = async () => {
  await restFull('/profile/passKeyBeginRegistration', 'GET')
    .then(async (res) => {
      const publicKey = res.publicKey
      publicKey.challenge = base64ToUint8Array(publicKey.challenge)
      publicKey.user.id = base64ToUint8Array(publicKey.user.id)
      await navigator.credentials.create({ publicKey })
        .then(async credential => {
          const rawId = credential.rawId
          const attestationObject = credential.response.attestationObject
          const clientDataJSON = credential.response.clientDataJSON
          const attestationResponse = JSON.stringify({
            id: credential.id,
            rawId: uint8ArrayToBase64(rawId),
            type: credential.type,
            response: {
              attestationObject: uint8ArrayToBase64(attestationObject),
              clientDataJSON: uint8ArrayToBase64(clientDataJSON)
            }
          })
          await restFull('/profile/passKeyFinishRegistration', 'POST', attestationResponse)
            .then(() => {
              ElMessage.success('注册成功')
            })
        })
        .catch(err => {
          ElMessage.error('注册失败')
          console.log(err)
        })
    })
}

const handleButtonSubmit = () => {
  handleRegistrationPassKey()
  closed()
}

const handleButtonCancel = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
}

</script>

<style scoped lang="scss">

</style>
