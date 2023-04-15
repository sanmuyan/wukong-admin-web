<template>
  <el-dialog @close="closed" width="500px" draggable title="角色创建">
    <el-form :model="role" ref="formRef" :rules="formRules" style="width: 380px">
      <el-form-item label="角色" label-width="100px" prop="role_name">
        <el-input v-model="role.role_name"></el-input>
      </el-form-item>
      <el-form-item label="等级" label-width="100px" prop="access_level">
        <el-input v-model="role.access_level"></el-input>
      </el-form-item>
      <el-form-item label="描述" label-width="100px" prop="comment">
        <el-input v-model="role.comment"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-button">
      <el-button type="primary" size="small" @click="closed">取消</el-button>
      <el-button type="primary" size="small" @click="handleCreateRole">提交</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { restFull } from '@/api'
import { ElMessage } from 'element-plus'
import { defineEmits, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const role = ref({})
const formRef = ref(null)

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
  comment: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ]
})

const emits = defineEmits(['update:modelValue', 'updateOk'])

const handleCreateRole = () => {
  formRef.value.validate(valid => {
    if (valid) {
      createRole()
    }
  })
}

const createRole = async () => {
  await restFull('/role', 'POST', {
    role_name: role.value.role_name,
    access_level: Number(role.value.access_level),
    comment: role.value.comment
  })
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.createSuccess'))
    })
  closed()
}

const closed = () => {
  emits('update:modelValue', false)
  emits('updateOk')
  role.value = {}
  formRef.value.clearValidate()
}

</script>

<style scoped>

</style>
