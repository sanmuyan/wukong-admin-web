<template>
  <div class="authorize-container">
    <el-dialog
      v-model="showDialog"
      :title="i18n.t('msg.login.isApproveLogin')"
      :before-close="handleClose"
      width="500"
      align-center
      center
    >
      <div class="authorize-text-container">
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">{{ i18n.t('msg.button.deny') }}</el-button>
          <el-button type="primary" @click="handleOauthAuthorize">{{ i18n.t('msg.button.approve') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router'
import { useI18n } from 'vue-i18n'
import { urlToParamsObj } from '@/utils/url'
import { restFull } from '@/api'

const i18n = useI18n()

const showDialog = ref(false)
const searchObj = ref({})

const handleOauthAuthorize = async () => {
  await restFull('/oauth/authorize', 'GET', searchObj.value)
    .then(data => {
      window.location.replace(data.redirect_uri)
    })
}

const handleClose = () => {
  showDialog.value = false
  router.push('/')
}

const handleSearch = () => {
  const location = window.location
  searchObj.value = urlToParamsObj(location.href)
  showDialog.value = true
}

handleSearch()
</script>

<style scoped lang="scss">
.authorize-container {
  overflow: hidden;

  .authorize-text-container {
    // width: 350px;
    height: 100px;
  }
}
</style>
