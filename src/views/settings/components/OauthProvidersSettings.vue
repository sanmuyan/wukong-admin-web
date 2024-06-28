<template>
  <el-card style="width: 500px">
    <el-table :data="configs" style="width: 100%">
      <el-table-column prop="provider" label="名称"/>
      <el-table-column label="操作" fixed="right">
        <template #default="{ row }">
          <el-switch
            v-model="row.enable"
            inline-prompt
            active-text="开启"
            inactive-text="关闭"
            style="margin-right: 10px"
          />
          <el-button type="primary" size="small" @click="handleProviderEdit(row)">编辑</el-button>
          <el-popconfirm @confirm="deleteProvider(row)" title="确定删除吗？">
            <template #reference>
              <el-button type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right; margin-top: 10px">
      <el-button type="primary" size="small" @click="handleProviderAdd">添加</el-button>
      <el-button type="primary" size="small" @click="handleButtonSubmit">应用</el-button>
    </div>
  </el-card>
  <oauth-providers-edit
    v-model="showEditDialog"
    :config="config"
    :title="editDialogTitle"
  />
</template>

<script setup>

import { defineModel, provide, ref, watch } from 'vue'
import { restFull } from '@/api'
import { resetObjValue } from '@/utils/utils'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import OauthProvidersEdit from '@/views/settings/components/OauthProvidersEdit.vue'

const i18n = useI18n()

// 父组件传入的值
const modelValue = defineModel({ required: true })

const configs = ref([])
const config = ref({
  enable: false,
  client_id: '',
  client_secret: '',
  redirect_url: '',
  auth_url: '',
  token_url: '',
  scopes: [],
  user_info_url: '',
  provider: ''
})

const getSettings = async () => {
  configs.value.forEach(item => {
    resetObjValue(item)
  })
  restFull('/settings/oauthProviders', 'GET').then(res => {
    configs.value = res
  })
}

const updateSettings = async () => {
  configs.value.forEach(item => {
    if (typeof item.scopes === 'string') {
      item.scopes = item.scopes.split(',')
    }
  })
  restFull('/settings/oauthProviders', 'POST', configs.value).then(res => {
    ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
    getSettings()
  })
}

const handleButtonSubmit = () => {
  updateSettings()
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
const showEditDialog = ref(false)
const editDialogTitle = ref('')

const handleUpdateProvider = (provider) => {
  const index = configs.value.findIndex(item => item.provider === provider.provider)
  if (index !== -1) {
    configs.value[index] = provider
  } else {
    configs.value.push(provider)
  }
}

provide('handleUpdateProvider', handleUpdateProvider)

const handleProviderEdit = (row) => {
  editDialogTitle.value = '编辑'
  showEditDialog.value = true
  config.value = row
}

const deleteProvider = (row) => {
  configs.value = configs.value.filter(item => item.provider !== row.provider)
}

const handleProviderAdd = () => {
  editDialogTitle.value = '新增'
  showEditDialog.value = true
}

</script>

<style scoped lang="scss">

</style>
