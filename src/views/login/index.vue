<template>
  <div class="login-container">
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
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LangSelect from '@/components/LangSelect/index.vue'
import { validatePassword } from '@/utils/rules'
import { useStore } from 'vuex'
import { Unlock, UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { restFull } from '@/api'
import { useI18n } from 'vue-i18n'

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
const handleLogin = async () => {
  loginFormRef.value.validate(valid => {
    if (!valid) return
    loading.value = true
    restFull('/login', 'POST', loginForm.value)
      .then(data => {
        store.dispatch('user/login', data.token)
        ElMessage.success(i18n.t('msg.login.loginSuccess'))
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  })
}

const handleOauthLogin = async (provider) => {
  restFull('/oauth/login', 'GET', { provider: provider })
    .then(data => {
      window.location.replace(data.auth_url)
    })
}

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
