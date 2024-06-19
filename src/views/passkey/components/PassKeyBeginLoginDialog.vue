<template>
  <el-dialog v-model="modelValue" width="350px" draggable title="通行密钥登录" @close="closed">
    <el-form :model="passKeyBeginLoginRequest" :rules="formRules" ref="formRef">
      <el-form-item prop="username">
        <el-input
          v-model="passKeyBeginLoginRequest.username"
          size="large"
          placeholder="用户名"
          name="username"
          type="text"
          :prefix-icon="UserFilled"
          >
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleButtonSubmit">下一步</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineModel, inject, ref, watch } from 'vue'
import { restFull } from '@/api'
import { UserFilled } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()
const formRef = ref(null)

// 父组件传入的值
const modelValue = defineModel({ required: true })
const passKeyBeginLoginDialogClosed = inject('passKeyBeginLoginDialogClosed')
const handlePassKeyFinishLogin = inject('handlePassKeyFinishLogin')
const username = defineModel('username', { required: false })
const passKeyBeginLoginRequest = ref({ username: '' })

const formRules = ref({
  username: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ]
})

const handlePassKeyBeginLogin = async () => {
  await restFull('/passKeyBeginLogin', 'POST', passKeyBeginLoginRequest.value)
    .then(res => {
      handlePassKeyFinishLogin(res)
    })
  closed()
}

const handleButtonSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      handlePassKeyBeginLogin()
    }
  })
}

watch(
  () => modelValue.value,
  val => {
    if (val) {
      passKeyBeginLoginRequest.value.username = username.value
    }
  })

const closed = () => {
  modelValue.value = false
  passKeyBeginLoginRequest.value = {
    username: ''
  }
  passKeyBeginLoginDialogClosed()
  formRef.value.clearValidate()
}

</script>

<style scoped lang="scss">

</style>
