<template>
  <el-dialog @close="closed" v-model="modelValue" width="500px" draggable title="用户创建">
    <el-form :model="user" :rules="formRules" ref="formRef" style="width: 380px">
      <el-form-item label="用户名" label-width="100px" prop="username">
        <el-input v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="显示名" label-width="100px" prop="display_name">
        <el-input v-model="user.display_name"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="100px" prop="password">
        <el-input v-model="user.password" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="100px" prop="email">
        <el-input v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" label-width="100px" prop="mobile">
        <el-input v-model="user.mobile"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="small" @click="handleButtonCancel">取消</el-button>
      <el-button type="primary" size="small" @click="handleButtonSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { restFull } from '@/api'
import { defineModel, inject, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const formRef = ref(null)
// 父组件传入的值
const modelValue = defineModel({ required: true })
const getUsers = inject('getUsers')
const user = ref({})

const formRules = ref({
  username: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  display_name: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  email: [
    {
      required: false,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  mobile: [
    {
      required: false,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ]
})

const createUser = async () => {
  await restFull('/user', 'POST', user.value)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.createSuccess'))
      closed()
      getUsers()
    })
}

const handleButtonSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      createUser()
    }
  })
}

const handleButtonCancel = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  user.value = {}
  formRef.value.clearValidate()
}

</script>

<style scoped>

</style>
