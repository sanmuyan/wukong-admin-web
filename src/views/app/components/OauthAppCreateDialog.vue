<template>
  <el-dialog @close="closed" v-model="modelValue" width="500px" draggable title="角色创建">
    <el-form :model="oauthApp" :rules="formRules" ref="formRef" style="width: 400px">
      <el-form-item label="应用名称" label-width="100px" prop="app_name">
        <el-input v-model="oauthApp.app_name"></el-input>
      </el-form-item>
      <el-form-item label="应用 ID" label-width="100px" prop="client_id">
        <el-input v-model="oauthApp.client_id" disabled></el-input>
      </el-form-item>
      <el-form-item label="应用秘钥" label-width="100px" prop="client_secret">
        <el-input v-model="oauthApp.client_secret" disabled></el-input>
      </el-form-item>
      <el-form-item label="重定向 URI" label-width="100px" prop="redirect_uri">
        <el-input
          v-model="oauthApp.redirect_uri"
          autosize
          type="textarea"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="Scope" label-width="100px" prop="scope">
        <!--        <el-input v-model="oauthApp.scope"></el-input>-->
        <div>
          <el-checkbox v-model="scopeProfile" label="profile" size="large"/>
          <el-checkbox v-model="scopeApi" label="api" size="large"/>
        </div>
      </el-form-item>
      <el-form-item label="描述" label-width="100px" prop="comment">
        <el-input v-model="oauthApp.comment"></el-input>
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
import { defineModel, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { generateUuid } from '@/utils/uuid'

const i18n = useI18n()
const formRef = ref(null)
// 父组件传入的值
const modelValue = defineModel({ required: true })
const getOauthApps = inject('getOauthApps')

const oauthApp = ref({})

const formRules = ref({
  app_name: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  client_id: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  client_secret: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ],
  comment: [
    {
      required: false,
      trigger: 'blur',
      message: i18n.t('msg.appMain.isRequired')
    }
  ]
})

const scopeProfile = ref(false)
const scopeApi = ref(false)

const createOauth = async () => {
  oauthApp.value.scope = ''
  if (scopeProfile.value) {
    oauthApp.value.scope += 'profile,'
  }
  if (scopeApi.value) {
    oauthApp.value.scope += 'api,'
  }
  if (oauthApp.value.scope) {
    oauthApp.value.scope = oauthApp.value.scope.replace(/,\s*$/gm, '')
  }
  if (oauthApp.value.redirect_uri) {
    oauthApp.value.redirect_uri = oauthApp.value.redirect_uri.replace(/\n/g, ',').replace(/,\s*$/gm, '')
  }
  await restFull('/oauth/app', 'POST', oauthApp.value)
    .then(() => {
      ElMessage.success(i18n.t('msg.appMain.createSuccess'))
      closed()
      getOauthApps()
    })
}

const handleButtonApply = () => {
  formRef.value.validate(valid => {
    if (valid) {
      createOauth()
    }
  })
}

const handleButtonClosed = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  oauthApp.value = {}
  formRef.value.clearValidate()
  scopeProfile.value = false
  scopeApi.value = false
}

// 使用uuid 生成 client_id 和 client_secret
watch(
  () => modelValue.value,
  val => {
    if (val) {
      generateClient()
    }
  }
)
const generateClient = () => {
  oauthApp.value.client_id = generateUuid()
  oauthApp.value.client_secret = generateUuid()
}

</script>

<style scoped>

</style>
