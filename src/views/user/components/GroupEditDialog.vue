<template>
  <el-dialog @close="closed" v-model="modelValue" width="500px" draggable title="用户编辑">
    <el-form :model="group" :rules="formRules" ref="formRef" style="width: 380px">
      <el-form-item label="组名" label-width="100px" prop="group_name">
        <el-input v-model="group.group_name" disabled></el-input>
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
import { ElMessage } from 'element-plus'
import { defineModel, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const formRef = ref(null)
// 父组件传入的值
const modelValue = defineModel({ required: true })
const groupEdit = defineModel('groupEdit', { required: true })
const getGroups = inject('getGroups')

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const group = ref(clone(groupEdit.value))

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

const getGroup = () => {
  group.value = clone(groupEdit.value)
}

watch(
  () => modelValue.value,
  val => {
    if (val) getGroup()
  }
)

const updateGroup = async () => {
  await restFull('/group', 'PUT', group.value)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      closed()
      getGroups()
    })
}

const handleButtonSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      updateGroup()
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
