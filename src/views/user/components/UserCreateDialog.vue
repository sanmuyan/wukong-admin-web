<template>
  <el-dialog @close="closed" width="500px" draggable title="用户创建">
    <el-form :model="user" :rules="formRules" ref="formRef" style="width: 380px">
      <el-form-item label="用户名" label-width="100px" prop="username" >
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
    <div class="dialog-button">
      <el-button type="primary" size="small" @click="closed">取消</el-button>
      <el-button type="primary" size="small" @click="handleCreateUser">提交</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { restFull } from '@/api'
import { defineEmits, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()

const user = ref({})

const formRef = ref(null)
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

const emits = defineEmits(['update:modelValue', 'updateOk'])

const handleCreateUser = () => {
  formRef.value.validate(valid => {
    if (valid) {
      createUser()
    }
  })
}

const createUser = async () => {
  await restFull('/user', 'POST', {
    username: user.value.username,
    display_name: user.value.display_name,
    password: user.value.password,
    email: user.value.email,
    mobile: user.value.mobile
  }).then(() => {
    ElMessage.success(i18n.t('msg.appMain.createSuccess'))
  })
  closed()
}

const closed = () => {
  emits('update:modelValue', false)
  emits('updateOk')
  user.value = {}
  formRef.value.clearValidate()
}

</script>

<style scoped>

</style>
