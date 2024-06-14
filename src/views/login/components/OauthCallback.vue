<template>
  <div class="login-container"></div>
</template>

<script setup>
import { restFull } from '@/api'
import { urlToParamsObj } from '@/utils/url'
import router from '@/router'
import { inject } from 'vue'
const handleLoginData = inject('handleLoginData')

const handleOauthCallback = async () => {
  await restFull('/oauth/callback', 'GET',
    urlToParamsObj(window.location.href))
    .then(async data => {
      await handleLoginData(data)
    })
    .catch(
      () => {
        router.push('/login')
      }
    )
}

handleOauthCallback()

</script>

<style scoped lang="scss">
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #eff4f9;
  overflow: hidden;
}
</style>
