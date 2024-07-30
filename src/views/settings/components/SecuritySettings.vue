<template>
  <el-card style="width: 500px">
    <el-form :model="config" :rules="formRules" ref="formRef" label-width="180px">
      <span>密码安全</span>
      <el-divider />
      <el-form-item label="密码最小长度" prop="password_min_length">
        <el-input v-model="config.password_min_length"></el-input>
      </el-form-item>
      <el-form-item label="密码复杂度" prop="password_complexity">
        <el-input v-model="config.password_complexity"></el-input>
      </el-form-item>
      <span>登录安全</span>
      <el-divider />
      <el-form-item label="登录会话超时" prop="token_ttl">
        <el-input v-model="config.token_ttl"></el-input>
      </el-form-item>
      <el-form-item label="登录最大失败次数" prop="login_max_fails">
        <el-input v-model="config.login_max_fails"></el-input>
      </el-form-item>
      <el-form-item label="登录锁定时间" prop="login_lock_time">
        <el-input v-model="config.login_lock_time"></el-input>
      </el-form-item>
      <el-form-item label="验证令牌会话" prop="disable_verify_token_session">
        <el-checkbox v-model="config.verify_token_session"></el-checkbox>
      </el-form-item>
      <span>安全设备</span>
      <el-divider />
      <el-form-item label="通行密钥登录" prop="pass_key_login">
        <el-checkbox v-model="config.pass_key_login"></el-checkbox>
      </el-form-item>
      <el-form-item label="要求开启 MFA" prop="require_mfa">
        <el-checkbox v-model="config.require_mfa"></el-checkbox>
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <el-button type="primary" size="small" @click="handleResetSubmit">重置</el-button>
      <el-button type="primary" size="small" @click="handleButtonSubmit">应用</el-button>
    </div>
  </el-card>
</template>

<script setup>

import { defineModel, ref, watch } from 'vue'
import { restFull } from '@/api'
import { cloneObj, fillObjValue } from '@/utils/utils'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

// 父组件传入的值
const modelValue = defineModel({ required: true })

const configTemplate = ref({
  token_ttl: 86400,
  verify_token_session: true,
  login_max_fails: 10,
  login_lock_time: 60,
  password_min_length: 8,
  password_complexity: 3,
  pass_key_login: false,
  require_mfa: false
})

const resetConfig = ref({})
const config = ref({})
const formRef = ref(null)
const formRules = {
  token_ttl: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ],
  login_max_fails: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ],
  login_lock_time: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ],
  password_complexity: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ],
  password_min_length: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ]
}

const getSettings = async () => {
  restFull('/settings/security', 'GET')
    .then(res => {
      config.value = cloneObj(configTemplate.value)
      fillObjValue(res.data, config.value)
      resetConfig.value = cloneObj(config.value)
    })
}

const updateSettings = async () => {
  config.value.token_ttl = parseInt(config.value.token_ttl)
  config.value.login_max_fails = parseInt(config.value.login_max_fails)
  config.value.login_lock_time = parseInt(config.value.login_lock_time)
  config.value.password_min_length = parseInt(config.value.password_min_length)
  config.value.password_complexity = parseInt(config.value.password_complexity)
  restFull('/settings/security', 'POST', config.value)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      getSettings()
    })
}

const handleButtonSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      updateSettings()
    }
  })
}

watch(
  () => modelValue.value,
  val => {
    if (val) {
      getSettings()
    }
  }
)

getSettings()

const handleResetSubmit = () => {
  config.value = cloneObj(resetConfig.value)
}

</script>

<style scoped lang="scss">

</style>
