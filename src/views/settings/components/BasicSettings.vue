<template>
  <el-card style="width: 500px">
    <el-form :model="config" :rules="formRules" ref="formRef" label-width="100px">
      <el-form-item label="站点 URL" prop="site_url">
        <el-input v-model="config.site_url"></el-input>
      </el-form-item>
      <el-form-item label="站点域名" prop="site_url">
        <el-input v-model="config.site_host"></el-input>
      </el-form-item>
      <el-form-item label="应用名" prop="app_name">
        <el-input v-model="config.app_name"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <el-button type="primary" size="small" @click="handleResetSubmit">重置</el-button>
      <el-button type="primary" size="small" @click="handleButtonSubmit">应用</el-button>
    </div>
  </el-card>
</template>

<script setup>

import { defineModel, ref, watch } from 'vue'
import { restFull } from '@/api'
import { cloneObj, fillObjValue } from '@/utils/utils'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

// 父组件传入的值
const modelValue = defineModel({ required: true })

const configTemplate = ref({
  site_url: 'http://localhost',
  site_host: 'localhost',
  app_name: 'wukong'
})

const resetConfig = ref({})
const config = ref({})

const formRef = ref(null)
const formRules = {
  site_url: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ],
  site_host: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ],
  app_name: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ]
}

const getSettings = async () => {
  restFull('/settings/basic', 'GET')
    .then(res => {
      config.value = cloneObj(configTemplate.value)
      fillObjValue(res.data, config.value)
      resetConfig.value = cloneObj(config.value)
    })
}

const updateSettings = async () => {
  restFull('/settings/basic', 'POST', config.value)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      getSettings()
    })
}

const handleButtonSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      updateSettings()
    }
  })
}

watch(
  () => modelValue.value,
  val => {
    if (val) {
      getSettings()
    }
  }
)

getSettings()

const handleResetSubmit = () => {
  config.value = cloneObj(resetConfig.value)
}

</script>

<style scoped lang="scss">

</style>
