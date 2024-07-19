<template>
  <el-card style="width: 500px">
    <el-form :model="config" :rules="formRules" ref="formRef" label-width="100px">
      <el-form-item label="启用 LDAP" prop="enable">
        <el-checkbox v-model="config.enable"/>
      </el-form-item>
      <el-form-item label="LDAP 地址" prop="url">
        <el-input v-model="config.url"></el-input>
      </el-form-item>
      <el-form-item label="管理员 DN" prop="admin_dn">
        <el-input v-model="config.admin_dn"></el-input>
      </el-form-item>
      <el-form-item label="管理员密码" prop="admin_password">
        <el-input v-model="config.admin_password" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="用户 OU" prop="search_base">
        <el-input v-model="config.search_base"></el-input>
      </el-form-item>
      <el-form-item label="用户过滤" prop="search_filter">
        <el-input v-model="config.search_filter"></el-input>
      </el-form-item>
      <el-form-item label="用户名属性" prop="username_attribute">
        <el-input v-model="config.username_attribute"></el-input>
      </el-form-item>
      <el-form-item label="属性映射" prop="attribute_map">
        <el-input v-model="config.attribute_map"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <el-button type="primary" size="small" @click="handleConnTest">测试连接</el-button>
      <el-button type="primary" size="small" @click="handleLoginTest">测试登录</el-button>
      <el-button type="primary" size="small" @click="handleSyncUser">同步用户</el-button>
      <el-button type="primary" size="small" @click="handleResetSubmit">重置</el-button>
      <el-button type="primary" size="small" @click="handleButtonSubmit">应用</el-button>
    </div>
  </el-card>
  <ldap-login-test-dialog v-model="showLoginTestDialog"/>
</template>

<script setup>

import { defineModel, ref, watch } from 'vue'
import { restFull } from '@/api'
import { cloneObj, fillObjValue } from '@/utils/utils'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import LdapLoginTestDialog from '@/views/settings/components/LdapLoginTestDialog.vue'

const i18n = useI18n()

// 父组件传入的值
const modelValue = defineModel({ required: true })

const configTemplate = ref({
  enable: false,
  url: '',
  search_base: '',
  search_filter: '((cn=*))',
  username_attribute: 'cn',
  attribute_map: '{"display_name":"displayName","email":"mail","mobile":"mobile"}',
  admin_dn: '',
  admin_password: ''
})
const resetConfig = ref({})
const config = ref({})
const formRef = ref(null)
const formRules = {
  url: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ],
  search_base: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ],
  search_filter: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ],
  username_attribute: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ],
  attribute_map: [
    {
      required: true,
      message: '必填项',
      trigger: 'blur'
    }
  ]
}

const getSettings = async () => {
  restFull('/settings/ldap', 'GET').then(res => {
    config.value = cloneObj(configTemplate.value)
    fillObjValue(res.data, config.value)
    config.value.attribute_map = JSON.stringify(config.value.attribute_map)
    resetConfig.value = cloneObj(config.value)
  })
}

const updateSettings = async () => {
  config.value.attribute_map = JSON.parse(config.value.attribute_map)
  restFull('/settings/ldap', 'POST', config.value)
    .then(() => {
      getSettings()
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
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

const handleSyncUser = () => {
  restFull('/ldap/user/sync', 'POST')
    .then(res => {
      ElMessage.success(res.message)
    })
}

const handleConnTest = () => {
  const req = cloneObj(config.value)
  req.attribute_map = JSON.parse(req.attribute_map)
  restFull('/ldap/connTest', 'POST', req)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.success'))
    })
}

const handleResetSubmit = () => {
  config.value = cloneObj(resetConfig.value)
}

const showLoginTestDialog = ref(false)
const handleLoginTest = () => {
  showLoginTestDialog.value = true
}

</script>

<style scoped lang="scss">

</style>
