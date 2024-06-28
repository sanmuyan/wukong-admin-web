<template>
  <div class="profile-container">
    <el-card>
      <h4>账号安全</h4>
      <el-divider/>
      <el-form style="width: 380px">
        <el-form-item label="注销会话" label-width="100px">
          <el-popconfirm @confirm="handleLogoutAll" title="确定注销所有会话？">
            <template #reference>
              <el-button type="danger" size="small">注销</el-button>
            </template>
          </el-popconfirm>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-button type="primary" size="small" @click="handleModifyPassword">修改</el-button>
        </el-form-item>
        <el-form-item label="MFA 应用" label-width="100px">
          <el-button v-if="!mfaAppEnabled" type="primary" size="small" @click="handleCreateMfaAppBind">开启</el-button>
          <el-popconfirm @confirm="handleDeleteMfaApp" title="确定关闭吗？">
            <template #reference>
              <el-button v-if="mfaAppEnabled" type="danger" size="small">关闭</el-button>
            </template>
          </el-popconfirm>
        </el-form-item>
        <el-form-item label="通行密钥" label-width="100px">
          <el-button type="primary" size="small" @click="handleShowPassKeyDrawer">查看</el-button>
          <el-button type="primary" size="small" @click="handleRegisterPassKey">新增</el-button>
        </el-form-item>
      </el-form>
      <el-divider/>
    </el-card>
    <mfa-app-bind-dialog
      v-model="showMfaAppBindDialog"
    >
    </mfa-app-bind-dialog>
    <pass-key-drawer
      v-model="showPassKeyDrawer"
    ></pass-key-drawer>
    <pass-key-register-dialog
      v-model="showRegisterPassKeyDialog"
    ></pass-key-register-dialog>
    <modify-password-dialog
      v-model="showModifyPasswordDialog"
    >
    </modify-password-dialog>
  </div>
</template>

<script setup>
import { provide, ref } from 'vue'
import { restFull } from '@/api'
import MfaAppBindDialog from '@/views/mfa/components/MfaAppBindDialog.vue'
import PassKeyDrawer from '@/views/passkey/components/PassKeyDrawer.vue'
import PassKeyRegisterDialog from '@/views/passkey/components/PassKeyRegisterDialog.vue'
import ModifyPasswordDialog from '@/views/home/components/ModifyPasswordDialog.vue'
import { ElMessage } from 'element-plus'
import store from '@/store'

const mfaAppEnabled = ref(false)
const showMfaAppBindDialog = ref(false)

const getMfaAppStatus = async () => {
  await restFull('/account/mfaAppStatus', 'GET')
    .then(res => {
      if (res.is_bind) {
        mfaAppEnabled.value = true
      }
    })
}

provide('getMfaAppStatus', getMfaAppStatus)
getMfaAppStatus()

const getBeginMfaAppBindResponse = async () => {
  return restFull('/account/mfaAppBeginBind', 'GET')
}
provide('getBeginMfaAppBindResponse', getBeginMfaAppBindResponse)
const handleCreateMfaAppBind = () => {
  showMfaAppBindDialog.value = true
}

const handleDeleteMfaApp = async () => {
  await restFull('/account/mfaApp', 'DELETE')
    .then(() => {
      mfaAppEnabled.value = false
    })
}

const showPassKeyDrawer = ref(false)

const handleShowPassKeyDrawer = () => {
  showPassKeyDrawer.value = true
}

const showRegisterPassKeyDialog = ref(false)

const handleRegisterPassKey = async () => {
  showRegisterPassKeyDialog.value = true
}

const showModifyPasswordDialog = ref(false)
const handleModifyPassword = () => {
  showModifyPasswordDialog.value = true
}

const handleLogoutAll = async () => {
  await restFull('/logout/all', 'POST')
    .then(() => {
      store.dispatch('login/logout')
      ElMessage.success('注销成功')
    })
}

</script>

<style lang="scss" scoped>
.profile-container {
  display: grid;
  grid-auto-rows: auto;
  grid-gap: 10px;

  .cell-item {
    display: flex;
    align-items: center;
  }

  .header {
    margin-bottom: 22px;
    text-align: right;
  }

  .pagination {
    margin-top: 20px;
    text-align: center;
  }

  :deep .dialog-button {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
