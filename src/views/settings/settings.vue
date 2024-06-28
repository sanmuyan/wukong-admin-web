<template>
  <el-tabs
    v-model="activeName"
    @tab-change="handleChange"
    type="border-card"
  >
    <el-tab-pane label="基本设置" name="basic">
      <basic-settings v-model="basic"></basic-settings>
    </el-tab-pane>
    <el-tab-pane label="安全设置" name="security">
      <security-settings v-model="security"></security-settings>
    </el-tab-pane>
    <el-tab-pane label="LDAP" name="ldap">
      <ldap-settings v-model="ldap"></ldap-settings>
    </el-tab-pane>
    <el-tab-pane label="第三方登录" name="oauthProviders">
      <oauth-providers-settings v-model="oauthProviders"></oauth-providers-settings>
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import BasicSettings from '@/views/settings/components/BasicSettings.vue'
import SecuritySettings from '@/views/settings/components/SecuritySettings.vue'
import LdapSettings from '@/views/settings/components/LdapSettings.vue'
import OauthProvidersSettings from '@/views/settings/components/OauthProvidersSettings.vue'
import { ref } from 'vue'
const activeName = ref('basic')
const basic = ref(0)
const security = ref(0)
const ldap = ref(0)
const oauthProviders = ref(0)

const handleChange = () => {
  switch (activeName.value) {
    case 'basic':
      basic.value += 1
      break
    case 'security':
      security.value += 1
      break
    case 'ldap':
      ldap.value += 1
      break
    case 'oauthProviders':
      oauthProviders.value += 1
      break
  }
}
</script>

<style scoped lang="scss">

</style>
