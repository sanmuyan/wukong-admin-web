<template>
  <el-dialog @close="closed" v-model="modelValue" width="500px" draggable title="用户编辑">
    <el-form ref="formRef" style="width: 380px">
      <el-form-item label="用户名" label-width="100px">
        <el-input v-model="user.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="显示名" label-width="100px">
        <el-input v-model="user.display_name" disabled></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="100px">
        <el-input v-model="user.password" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="100px">
        <el-input v-model="user.email" disabled></el-input>
      </el-form-item>
      <el-form-item label="手机号" label-width="100px">
        <el-input v-model="user.mobile" disabled></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-button">
      <el-button type="primary" size="small" @click="handleButtonClosed">取消</el-button>
      <el-button type="primary" size="small" @click="handleButtonApply">提交</el-button>
    </div>
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
const userEdit = defineModel('userEdit', { required: true })
const refreshUserProfile = inject('refreshUserProfile')

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const user = ref(clone(userEdit.value))

const getUser = async () => {
  user.value = clone(userEdit.value)
}

watch(
  () => modelValue.value,
  val => {
    if (val) getUser()
  }
)

const updateUser = async () => {
  await restFull('/profile', 'PUT', {
    id: user.value.id,
    username: user.value.username,
    display_name: user.value.display_name,
    password: user.value.password,
    email: user.value.email,
    mobile: user.value.mobile
  })
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      refreshUserProfile()
      closed()
    })
}

const handleButtonApply = () => {
  // formRef.value.validate(valid => {
  //   if (valid) {
  //     updateUser()
  //   }
  // })
  updateUser()
}

const handleButtonClosed = () => {
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
