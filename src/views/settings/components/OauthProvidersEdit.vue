<template>
<el-form>
  <el-dialog
    :title="title"
    v-model="modelValue"
    @close="handleButtonCancel">
    <el-form :model="config" :rules="formRules" ref="formRef" label-width="100px">
      <el-form-item label="名称" prop="provider">
        <el-input v-model="config.provider"></el-input>
      </el-form-item>
      <el-form-item label="客户端 ID" prop="client_id">
        <el-input v-model="config.client_id"></el-input>
      </el-form-item>
      <el-form-item label="客户端密钥" prop="client_secret">
        <el-input v-model="config.client_secret"></el-input>
      </el-form-item>
      <el-form-item label="鉴权地址" prop="auth_url">
        <el-input v-model="config.auth_url"></el-input>
      </el-form-item>
      <el-form-item label="Token 地址" prop="token_url">
        <el-input v-model="config.token_url"></el-input>
      </el-form-item>
      <el-form-item label="用户地址" prop="user_info_url">
        <el-input v-model="config.user_info_url"></el-input>
      </el-form-item>
      <el-form-item label="权限范围" prop="scopes">
        <el-input v-model="config.scopes"></el-input>
      </el-form-item>
      <el-form-item label="回调地址" prop="redirect_url">
        <el-input v-model="config.redirect_url"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="small" @click="handleButtonCancel">取消</el-button>
      <el-button type="primary" size="small" @click="handleButtonSubmit">确定</el-button>
    </template>
  </el-dialog>
</el-form>
</template>

<script setup>
import { defineModel, inject, ref, watch } from 'vue'

// 父组件传入的值
const modelValue = defineModel({ required: true })
const configEdit = defineModel('config', { required: true })
const title = defineModel('title', { required: true })
const handleUpdateProvider = inject('handleUpdateProvider')

const config = ref({})

const formRef = ref(null)
const formRules = {
  provider: [
    {
      required: true,
      trigger: 'blur',
      message: '必填项'
    }
  ],
  client_id: [
    {
      required: true,
      trigger: 'blur',
      message: '必填项'
    }
  ],
  client_secret: [
    {
      required: false,
      trigger: 'blur',
      message: '必填项'
    }
  ],
  auth_url: [
    {
      required: true,
      trigger: 'blur',
      message: '必填项'
    }
  ],
  token_url: [
    {
      required: true,
      trigger: 'blur',
      message: '必填项'
    }
  ],
  user_info_url: [
    {
      required: true,
      trigger: 'blur',
      message: '必填项'
    }
  ],
  scopes: [
    {
      required: true,
      trigger: 'blur',
      message: '必填项'
    }
  ],
  redirect_url: [
    {
      required: true,
      trigger: 'blur',
      message: '必填项'
    }
  ]
}

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

watch(
  () => modelValue.value,
  val => {
    if (val && title.value === '编辑') {
      config.value = clone(configEdit.value)
    }
  }
)

const updateProvider = () => {
  handleUpdateProvider(config.value)
}

const handleButtonSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      updateProvider()
      handleButtonCancel()
    }
  })
}

const handleButtonCancel = () => {
  config.value = {}
  modelValue.value = false
  formRef.value.clearValidate()
}

</script>

<style scoped lang="scss">

</style>
