<template>
  <el-dialog @close="closed" v-model="modelValue" width="500px" draggable title="修改基本信息">
    <el-form ref="formRef" style="width: 380px">
      <el-form-item label="用户名" label-width="100px">
        <el-input v-model="user.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="显示名" label-width="100px">
        <el-input v-model="user.display_name"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="100px">
        <el-input v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号" label-width="100px">
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
import { ElMessage } from 'element-plus'
import { defineModel, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const formRef = ref(null)
// 父组件传入的值
const modelValue = defineModel({ required: true })
const profileEdit = defineModel('profileEdit', { required: true })
const refreshAccountProfile = inject('refreshAccountProfile')

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const user = ref(clone(profileEdit.value))

const getProfile = async () => {
  user.value = clone(profileEdit.value)
}

watch(
  () => modelValue.value,
  val => {
    if (val) getProfile()
  }
)

const updateProfile = async () => {
  await restFull('/account/profile', 'PUT', {
    id: user.value.id,
    display_name: user.value.display_name,
    email: user.value.email,
    mobile: user.value.mobile
  })
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      refreshAccountProfile()
      closed()
    })
}

const handleButtonSubmit = () => {
  // formRef.value.validate(valid => {
  //   if (valid) {
  //     updateProfile()
  //   }
  // })
  updateProfile()
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
