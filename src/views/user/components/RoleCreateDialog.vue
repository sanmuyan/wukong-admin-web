<template>
  <el-dialog @close="closed" v-model="modelValue" width="500px" draggable title="角色创建">
    <el-form :model="role" :rules="formRules" ref="formRef" style="width: 380px">
      <el-form-item label="角色" label-width="100px" prop="role_name">
        <el-input v-model="role.role_name"></el-input>
      </el-form-item>
      <el-form-item label="等级" label-width="100px" prop="access_level">
        <el-input v-model="role.access_level" type="number" min="1" max="100"></el-input>
      </el-form-item>
      <el-form-item label="用户菜单" label-width="100px" prop="user_menus">
        <el-input v-model="role.user_menus"></el-input>
      </el-form-item>
      <el-form-item label="描述" label-width="100px" prop="comment">
        <el-input v-model="role.comment"></el-input>
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
import { defineModel, inject, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const formRef = ref(null)
// 父组件传入的值
const modelValue = defineModel({ required: true })
const getRoles = inject('getRoles')

const role = ref({})

const formRules = ref({
  role_name: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  access_level: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  user_menus: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  comment: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ]
})

const createRole = async () => {
  role.value.access_level = Number(role.value.access_level)
  await restFull('/role', 'POST', role.value)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.createSuccess'))
      closed()
      getRoles()
    })
}

const handleButtonApply = () => {
  formRef.value.validate(valid => {
    if (valid) {
      createRole()
    }
  })
}

const handleButtonClosed = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  role.value = {}
  formRef.value.clearValidate()
}

</script>

<style scoped>

</style>
