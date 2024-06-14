<template>
  <el-dialog @close="closed" v-model="modelValue" width="320px" draggable title="绑定 MFA">
    <div v-if="isTimeout">
      <el-button type="warning" class="m-2" @click="beginMfaBind">超时刷新</el-button>
    </div>
    <div v-if="!isTimeout"  class="mfa-bind-container">
      <div>请使用 MFA 应用扫码</div>
      <div class="mfa-bind-qrcode">
        <el-image v-if="mfaImageURL" :src="mfaImageURL"/>
      </div>
      <div>
        <el-popover
          placement="bottom"
          title="共享秘钥"
          :width="200"
          trigger="click"
          :content="mfaBindReq.totp_secret"
        >
          <template #reference>
            <el-button class="m-2">手动绑定</el-button>
          </template>
        </el-popover>
      </div>
      <div>请输入 MFA 应用扫码后展示的验证码</div>
      <div>
        <el-form :model="mfaBindReq" :rules="formRules" ref="formRef">
          <el-form-item label="验证码" prop="totp_code">
            <el-input v-model="mfaBindReq.totp_code" minlength="6" maxlength="6" style="width: 150px"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" size="small" @click="handleButtonClosed">取消</el-button>
      <el-button :disabled="isTimeout" type="primary" size="small" @click="handleButtonApply">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { restFull } from '@/api'
import { defineModel, inject, ref, watch } from 'vue'
import { generateQrCode } from '@/utils/qrcode'
import { validateNumber } from '@/utils/rules'

// 父组件传入的值
const modelValue = defineModel({ required: true })
const getMfaAppStatus = inject('getMfaAppStatus')
const mfaAppImageURL = ref('')

const formRef = ref(null)

const formRules = ref({
  totp_code: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入6位数字',
      validator: validateNumber()
    },
    {
      required: true,
      min: 6,
      max: 6,
      message: '请输入6位数字',
      trigger: 'blur'
    }
  ]
})

const isTimeout = ref(false)

const mfaBindReq = ref({
  totp_secret: '',
  totp_code: ''
})

const beginMfaAppBind = async () => {
  await restFull('/profile/mfaAppBeginBind', 'GET')
    .then(async (res) => {
      mfaBindReq.value.totp_secret = res.totp_secret
      mfaAppImageURL.value = await generateQrCode(res.qr_code_uri)
      isTimeout.value = false
      if (res.timeout_min) {
        setTimeout(() => {
          if (modelValue.value) {
            isTimeout.value = true
            mfaBindReq.value.totp_secret = ''
            mfaBindReq.value.totp_code = ''
          }
        }, res.timeout_min * 60 * 1000)
      }
    })
}

watch(
  () => modelValue.value,
  async val => {
    if (val) {
      await beginMfaAppBind()
    }
  }
)

const finishMfaAppBind = async () => {
  await restFull('/profile/mfaAppFinishBind', 'POST', mfaBindReq.value)
    .then(() => {
      getMfaAppStatus()
      closed()
    })
}

const handleButtonApply = () => {
  formRef.value.validate(valid => {
    if (valid) {
      finishMfaAppBind()
    }
  })
}

const handleButtonClosed = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  mfaBindReq.value.totp_secret = ''
  mfaBindReq.value.totp_code = ''
  formRef.value.clearValidate()
}

</script>

<style scoped lang="scss">
.mfa-bind-container {
  display: grid;
  grid-auto-rows: auto;
  grid-gap: 10px;
    .mfa-bind-qrcode {
      border: 2px solid #cbd4da;
      width: 164px;
      height: 164px;
    }
}
</style>
