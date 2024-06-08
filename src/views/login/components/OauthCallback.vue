<template>
  <div class="login-container"></div>
</template>

<script setup>
import { restFull } from '@/api'
import store from '@/store'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { urlToParamsObj } from '@/utils/url'
import router from '@/router'

const i18n = useI18n()

const getToken = async () => {
  await restFull('/oauth/callback', 'GET',
    urlToParamsObj(window.location.href))
    .then(async data => {
      await store.dispatch('user/login', data.token)
      ElMessage.success(i18n.t('msg.login.loginSuccess'))
    }).catch(
      () => {
        router.push('/login')
      }
    )
}

getToken()

</script>

<style scoped lang="scss">
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #eff4f9;
  overflow: hidden;
}
</style>
