<template>
  <el-dialog
    v-model="modelValue"
    :title="$t('msg.login.mfaAppCodeDialogTitle')"
    width="280"
    center
    align-center
    @close="closed"
  >
    <el-form :model="formData" ref="formRef" :rules="formRules">
      <el-form-item label="验证码" prop="totpCode">
        <el-input
          style="width: 150px"
          v-model="formData.totpCode"
          type="text"
          clearable
          maxlength="6"
          minlength="6"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" style="width: 150px;" @click="handleButtonSubmit">{{
          $t('msg.button.confirm')
        }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineModel, inject, ref } from 'vue'
import { validateNumber } from '@/utils/rules'

// 父组件传入的值
const modelValue = defineModel({ required: true })
const handleMfaFinishLogin = inject('handleMfaFinishLogin')
const mfaAppLoginDialogClosed = inject('mfaAppLoginDialogClosed')

const formData = ref({
  totpCode: ''
})

const formRef = ref(null)

const formRules = ref({
  totpCode: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入6位数字',
      validator: validateNumber()
    },
    {
      required: true,
      min: 6,
      max: 6,
      message: '请输入6位数字',
      trigger: 'blur'
    }
  ]
})

const handleButtonSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      handleMfaFinishLogin(formData.value.totpCode)
      closed()
    }
  })
}

const closed = () => {
  modelValue.value = false
  formData.value.totpCode = ''
  mfaAppLoginDialogClosed()
  formRef.value.clearValidate()
}

</script>

<style scoped>

</style>
