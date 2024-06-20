<template>
  <div class="login-container" v-if="showLogin">
    <el-form
      v-loading="loading"
      class="login-form"
      :model="loginForm"
      :rules="loginRules"
      ref="loginFormRef">
      <div class="title-container">
        {{ $t('msg.login.title') }}
      </div>
      <lang-select class="lang-select" effect="light"></lang-select>
      <div class="title-line"></div>
      <!--      用户名-->
      <el-form-item prop="username">
        <el-input
          size="large"
          placeholder="用户名"
          name="username"
          type="text"
          :prefix-icon="UserFilled"
          v-model="loginForm.username">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <!--      密码-->
        <el-input
          clearable
          size="large"
          placeholder="密码"
          name="password"
          v-model="loginForm.password"
          type="password"
          show-password
          :prefix-icon="Unlock"
        >
        </el-input>
      </el-form-item>
      <el-button type="primary" style="width: 100%; margin-bottom: 30px" @click="handleLogin">
        {{ $t('msg.login.loginBtn') }}
      </el-button>
      <div class="tips" v-html="$t('msg.login.desc')"></div>
      <div class="other-login-container">
        <span class="other-login-container-text">{{ $t('msg.login.otherLogin') }}</span>
        <el-button
          type="info"
          size="small"
          round
          @click="handleOauthLogin('gitlab')"
        >
          GitLab
        </el-button>
        <el-button
          type="info"
          size="small"
          round
          @click="handlePassKeyBeginLogin()"
        >
          通行密钥
        </el-button>
      </div>
    </el-form>
  </div>
  <oauth-callback v-if="showOauthCallbackLogin">
  </oauth-callback>
  <mfa-app-login-dialog
    v-model="showMfaAppLoginDialog">
  </mfa-app-login-dialog>
  <pass-key-finish-login-dialog
    v-model="showPassKeyFinishLoginDialog"
    :passKeyBeginLoginResponse="passKeyBeginLoginResponse">
  </pass-key-finish-login-dialog>
  <pass-key-begin-login-dialog
    v-model="showPassKeyBeginLoginDialog"
    :username="loginForm.username"
  >
  </pass-key-begin-login-dialog>
</template>

<script setup>
import { provide, ref } from 'vue'
import LangSelect from '@/components/LangSelect/index.vue'
import { validatePassword } from '@/utils/rules'
import { useStore } from 'vuex'
import { Unlock, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { restFull } from '@/api'
import { useI18n } from 'vue-i18n'
import { urlToParamsObj } from '@/utils/url'
import OauthCallback from './components/OauthCallback'
import MfaAppLoginDialog from '@/views/mfa/components/MfaAppLoginDialog'
import PassKeyFinishLoginDialog from '@/views/passkey/components/PassKeyFinishLoginDialog.vue'
import PassKeyBeginLoginDialog from '@/views/passkey/components/PassKeyBeginLoginDialog.vue'
import { encryptClientData } from '@/utils/security'

const i18n = useI18n()
const loginForm = ref({
  username: 'admin',
  password: 'XXxx@1234'
})
const loginRules = ref({
  username: [
    {
      required: true,
      trigger: 'blur',
      message: i18n.t('msg.login.usernameRule')
    }
  ],
  password: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePassword()
    }
  ]
})

const loading = ref(false)
const store = useStore()
const loginFormRef = ref(null)
const showMfaAppLoginDialog = ref(false)

const handleLoginData = async (data) => {
  // 判断是否需要 PassKey
  if (data.pass_key_begin_login) {
    handlePassKeyFinishLogin(data.pass_key_begin_login)
    return
  }
  // 判断是否需要二次认证
  if (data.mfa_begin_login) {
    mfaLoginRequest.value = data.mfa_begin_login
    switch (data.mfa_begin_login.mfa_provider) {
      case 'mfa_app':
        showMfaAppLoginDialog.value = true
        break
      default:
        break
    }
    return
  }
  await store.dispatch('login/login', data.token)
  ElMessage.success(i18n.t('msg.login.loginSuccess'))
}
provide('handleLoginData', handleLoginData)

// 处理账号密码登录
const handleLogin = async () => {
  const req = JSON.parse(JSON.stringify(loginForm.value))
  await encryptClientData(req.password).then(res => {
    req.password = res
  })
  await loginFormRef.value.validate(async valid => {
    if (!valid) return
    loading.value = true
    await restFull('/login', 'POST', req)
      .then(async data => {
        await handleLoginData(data)
      })
      .catch(() => {})
  })
  loading.value = false
  loginForm.value.password = ''
}

// 处理第三方登录
const handleOauthLogin = async (provider) => {
  restFull('/oauth/login', 'GET', { provider: provider })
    .then(data => {
      window.location.replace(data.auth_url)
    })
}

// 处理二次认证登录
const mfaLoginRequest = {}

const handleMfaFinishLogin = async (mfaCode) => {
  if (!mfaCode) {
    return
  }
  mfaLoginRequest.value.code = mfaCode
  await restFull('/mfaFinishLogin', 'POST', mfaLoginRequest.value)
    .then(async data => {
      await handleLoginData(data)
    })
  mfaAppLoginDialogClosed()
}
provide('handleMfaFinishLogin', handleMfaFinishLogin)

const mfaAppLoginDialogClosed = () => {
  loading.value = false
  mfaLoginRequest.value = {}
}

provide('mfaAppLoginDialogClosed', mfaAppLoginDialogClosed)

// 处理 PassKey 登录
const showPassKeyFinishLoginDialog = ref(false)
const passKeyBeginLoginResponse = ref({})

const handlePassKeyFinishLogin = (data) => {
  passKeyBeginLoginResponse.value = data
  showPassKeyFinishLoginDialog.value = true
}

const passKeyFinishLoginDialogClosed = () => {
  loading.value = false
  passKeyBeginLoginResponse.value = {}
}

provide('passKeyFinishLoginDialogClosed', passKeyFinishLoginDialogClosed)

const showPassKeyBeginLoginDialog = ref(false)
const handlePassKeyBeginLogin = () => {
  showPassKeyBeginLoginDialog.value = true
}

const passKeyBeginLoginDialogClosed = () => {
}

provide('passKeyBeginLoginDialogClosed', passKeyBeginLoginDialogClosed)
provide('handlePassKeyFinishLogin', handlePassKeyFinishLogin)

// 处理登录后需要跳转的情况，比如 /login?callback=https://www.baidu.com 登录后会跳转到 https://www.baidu.com
const handleCallback = () => {
  let newHref = ''
  if (window.location.search) {
    const searchObj = urlToParamsObj(window.location.href)
    if (searchObj.callback) {
      for (const k in searchObj) {
        if (k === 'callback') {
          newHref = searchObj[k]
        } else {
          if (newHref) {
            newHref += `&${k}=${searchObj[k]}`
          }
        }
      }
    }
  }
  if (newHref) {
    store.dispatch('login/newLoginCallback', newHref)
  } else {
    store.dispatch('login/removeLoginCallback')
  }
}

const showLogin = ref(false)
const showOauthCallbackLogin = ref(false)

const handleViewRouter = () => {
  switch (window.location.pathname) {
    case '/oauth/callback':
      showOauthCallbackLogin.value = true
      break
    case '/login':
      showLogin.value = true
      handleCallback()
      break
    default:
      break
  }
}

handleViewRouter()

</script>
<style lang="scss" scoped>

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: #eff4f9;
  overflow: hidden;

  .login-form {
    background-color: #fff;
    position: relative;
    width: 320px;
    padding: 20px;
    margin: 140px auto 40px;
    overflow: hidden;

    .title-container {
      position: relative;
      font-weight: 600;
      font-size: 12px;
      color: #242e42;
      line-height: 20px;
      text-align: center;
    }

    .lang-select {
      border-style: none;
      position: absolute;
      top: 4px;
      right: 0;
      background-color: white;
      font-size: 24px;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
    }

    .title-line {
      width: 100%;
      height: 0;
      margin-top: 12px;
      margin-bottom: 20px;
      opacity: .6;
      border-bottom: 1px solid;
      border-image-source: radial-gradient(circle at 50% 0, #abb4be, #fff 100%);
      border-image-slice: 1;
    }

    .tips {
      font-size: 16px;
      line-height: 28px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .other-login-container {
      .other-login-container-text {
        font-size: 12px;
        color: rgb(155, 158, 160);
        margin-right: 20px;
      }
    }
  }
}
</style>
