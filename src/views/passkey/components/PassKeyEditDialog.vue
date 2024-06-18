<template>
  <el-dialog @close="closed" v-model="modelValue" width="500px" draggable title="通行密钥编辑">
    <el-form :model="passKey" :rules="formRules" ref="formRef" style="width: 380px">
      <el-form-item label="名称" label-width="100px" prop="display_name">
        <el-input v-model="passKey.display_name"></el-input>
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
const passKeyEdit = defineModel('passKeyEdit', { required: true })
const getPasskeys = inject('getPassKeys')

const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

const passKey = ref(clone(passKeyEdit.value))

const formRules = ref({
  display_name: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ]
})

const getPassKey = async () => {
  passKey.value = clone(passKeyEdit.value)
}

watch(
  () => modelValue.value,
  val => {
    if (val) getPassKey()
  }
)

const updateData = async () => {
  await restFull('/account/passKey', 'PUT', { id: passKey.value.id, display_name: passKey.value.display_name })
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      closed()
      getPasskeys()
    })
}

const handleButtonSubmit = () => {
  formRef.value.validate(valid => {
    if (valid) {
      updateData()
    }
  })
}

const handleButtonCancel = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  passKey.value = {}
  formRef.value.clearValidate()
}

</script>

<style scoped>

</style>
