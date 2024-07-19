<template>
  <div class="login-container"></div>
</template>

<script setup>
import { restFull } from '@/api'
import { urlToParamsObj } from '@/utils/url'
import { CALLBACK_LOGIN_BIND_DATA, CALLBACK_LOGIN_DATA } from '@/constant'
import { setLocalItem } from '@/utils/storage'

const handleOauthCallback = async (params) => {
  await restFull('/oauth/callback', 'GET', params)
    .then(async res => {
      setLocalItem(CALLBACK_LOGIN_DATA, res.data)
      window.close()
    })
}

const handleOauthBindCallback = async (params) => {
  await restFull('/account/oauthBindCallback', 'GET', params)
    .then(() => {
      setLocalItem(CALLBACK_LOGIN_BIND_DATA, 'yes')
    })
  window.close()
}

const handleViewRouter = () => {
  const params = urlToParamsObj(window.location.href)
  if (params.state.includes('bind_')) {
    // 如果 state 参数中有 bind_ 关键字 说明是绑定回调
    params.state = params.state.replace('bind_', '')
    handleOauthBindCallback(params)
    return
  }
  handleOauthCallback(params)
}

handleViewRouter()

</script>

<style scoped lang="scss">
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #eff4f9;
  overflow: hidden;
}
</style>
