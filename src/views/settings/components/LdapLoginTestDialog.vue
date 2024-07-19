<template>
  <el-dialog
    @close="closed"
    v-model="modelValue"
    width="350px" draggable
    title="登录测试">
    <el-form :model="config" label-width="80px" :rules="formRules" ref="formRef">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="config.username"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="config.password" type="password" show-password/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="small" @click="handleButtonCancel">取消</el-button>
      <el-button type="primary" size="small" @click="handleButtonSubmit">登录</el-button>
    </template>
  </el-dialog>
</template>

<script setup>

import { restFull } from '@/api'
import { defineModel, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { encryptClientData } from '@/utils/security'
import { cloneObj } from '@/utils/utils'

const i18n = useI18n()

// 父组件传入的值
const modelValue = defineModel({ required: true })

const formRef = ref(null)
const formRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ]
}

const config = ref({
  username: '',
  password: ''
})

const handleLoginTest = async () => {
  const req = cloneObj(config.value)
  await encryptClientData(req.password).then(data => {
    req.password = data
  })
  restFull('/ldap/loginTest', 'POST', req)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.success'))
    })
}

const handleButtonSubmit = () => {
  if (formRef.value) {
    formRef.value.validate((valid) => {
      if (valid) {
        handleLoginTest()
      }
    })
  }
}

const handleButtonCancel = () => {
  closed()
}

const closed = () => {
  config.value = {
    username: '',
    password: ''
  }
  modelValue.value = false
}

</script>

<style scoped lang="scss">

</style>
