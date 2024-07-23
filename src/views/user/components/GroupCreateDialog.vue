<template>
  <el-dialog @close="closed" v-model="modelValue" width="500px" draggable title="用户创建">
    <el-form :model="group" :rules="formRules" ref="formRef" style="width: 380px">
      <el-form-item label="组名" label-width="100px" prop="group_name">
        <el-input v-model="group.group_name"></el-input>
      </el-form-item>
      <el-form-item label="显示名" label-width="100px" prop="display_name">
        <el-input v-model="group.display_name"></el-input>
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
const getGroups = inject('getGroups')
const group = ref({})

const formRules = ref({
  group_name: [
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
  ]
})

const createGroup = async () => {
  await restFull('/group', 'POST', group.value)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.createSuccess'))
      closed()
      getGroups()
    })
}

const handleButtonSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      createGroup()
    }
  })
}

const handleButtonCancel = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  group.value = {}
  formRef.value.clearValidate()
}

</script>

<style scoped>

</style>
