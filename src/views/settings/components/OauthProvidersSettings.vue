<template>
  <el-card style="width: 500px">
    <el-form style="width: 100px" label-width="80px">
      <el-form-item label="GitLab">
        <el-button type="primary" size="small" @click="handleShowEditDialog('gitlab')">设置</el-button>
      </el-form-item>
      <el-form-item label="企业微信">
        <el-button type="primary" size="small" @click="handleShowEditDialog('wecom')">设置</el-button>
      </el-form-item>
      <el-form-item label="钉钉">
        <el-button type="primary" size="small" @click="handleShowEditDialog('dingtalk')">设置</el-button>
      </el-form-item>
    </el-form>
    <div style="text-align: right; margin-top: 10px">
      <el-button type="primary" size="small" @click="handleResetSubmit">重置</el-button>
      <el-button type="primary" size="small" @click="handleButtonSubmit">应用</el-button>
    </div>
  </el-card>
  <oauth-providers-edit-dialog
    :editTitle="editTitle"
    :editType="editType"
    v-model="showEditDialog"
    :config="editConfig">
  </oauth-providers-edit-dialog>
</template>

<script setup>

import { defineModel, provide, ref, watch } from 'vue'
import { restFull } from '@/api'
import { cloneObj, fillObjValue } from '@/utils/utils'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import OauthProvidersEditDialog from '@/views/settings/components/OauthProvidersEditDialog.vue'

const i18n = useI18n()

// 父组件传入的值
const modelValue = defineModel({ required: true })

const configTemplate = ref({
  enable: false,
  corp_id: '',
  client_id: '',
  client_secret: '',
  redirect_url: '',
  auth_url: '',
  token_url: '',
  scopes: '',
  user_info_url: ''
})

const config = ref({
  gitlab: cloneObj(configTemplate.value),
  we_com: cloneObj(configTemplate.value),
  ding_talk: cloneObj(configTemplate.value)
})
const resetConfig = ref({})
const editConfig = ref({})

const getSettings = async () => {
  restFull('/settings/oauthProviders', 'GET')
    .then(res => {
      config.value = res.data
      resetConfig.value = cloneObj(config.value)
    })
}

const updateSettings = async () => {
  restFull('/settings/oauthProviders', 'POST', config.value)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      getSettings()
    })
}

const handleButtonSubmit = () => {
  updateSettings()
}

const handleUpdateProvider = (providerConfig) => {
  switch (editType.value) {
    case 'gitlab':
      config.value.gitlab = providerConfig
      break
    case 'wecom':
      config.value.we_com = providerConfig
      break
    case 'dingtalk':
      config.value.ding_talk = providerConfig
      break
  }
}

provide('handleUpdateProvider', handleUpdateProvider)

const showEditDialog = ref(false)
const editTitle = ref('')
const editType = ref('')

const handleShowEditDialog = (type) => {
  editType.value = type
  switch (editType.value) {
    case 'gitlab':
      editTitle.value = 'GitLab 设置'
      editConfig.value = cloneObj(configTemplate.value)
      if (config.value.gitlab) fillObjValue(config.value.gitlab, editConfig.value)
      break
    case 'wecom':
      editTitle.value = '企业微信设置'
      editConfig.value = cloneObj(configTemplate.value)
      if (config.value.we_com) fillObjValue(config.value.we_com, editConfig.value)
      break
    case 'dingtalk':
      editTitle.value = '钉钉设置'
      editConfig.value = cloneObj(configTemplate.value)
      if (config.value.ding_talk) fillObjValue(config.value.ding_talk, editConfig.value)
      break
  }
  showEditDialog.value = true
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
