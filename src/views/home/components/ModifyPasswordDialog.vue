<template>
  <el-dialog @close="closed" v-model="modelValue" width="500px" draggable title="修改密码">
    <el-form :model="modifyPasswordRequest" :rules="formRules" ref="formRef" style="width: 380px">
      <el-form-item label="新密码" prop="new_password"  label-width="100px">
        <el-input type="password" clearable show-password v-model="modifyPasswordRequest.new_password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_password"  label-width="100px">
        <el-input type="password" clearable show-password v-model="modifyPasswordRequest.confirm_password"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="small" @click="handleButtonSubmit">提交</el-button>
      <el-button type="primary" size="small" @click="handleButtonCancel">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { restFull } from '@/api'
import { ElMessage } from 'element-plus'
import { defineModel, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { encryptClientData } from '@/utils/security'

const i18n = useI18n()
const formRef = ref(null)
// 父组件传入的值
const modelValue = defineModel({ required: true })

const modifyPasswordRequest = ref({
  new_password: '',
  confirm_password: ''
})

const validateConfirmPassword = () => {
  return (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== modifyPasswordRequest.value.new_password) {
      callback(new Error('两次输入的密码不一致'))
    } else {
      callback()
    }
  }
}

const formRules = ref({
  new_password: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入密码'
    }
  ],
  confirm_password: [
    {
      required: true,
      trigger: 'blur',
      validator: validateConfirmPassword()
    }
  ]
})

const handleModifyPassword = async () => {
  delete modifyPasswordRequest.value.confirm_password
  await encryptClientData(modifyPasswordRequest.value.new_password)
    .then(res => {
      modifyPasswordRequest.value.new_password = res
    })
  await restFull('/account/modifyPassword', 'POST', modifyPasswordRequest.value)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      closed()
    })
}

const handleButtonSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      handleModifyPassword()
    }
  })
}

const handleButtonCancel = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  modifyPasswordRequest.value = {
    new_password: '',
    confirm_password: ''
  }
  formRef.value.clearValidate()
}

</script>

<style scoped>

</style>
