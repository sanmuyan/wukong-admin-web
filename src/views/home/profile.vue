<template>
  <div class="profile-container">
    <el-card>
      <h4>账号资料</h4>
      <el-divider/>
      <el-descriptions
        title="基本信息"
        direction="vertical"
        :column="2"
        border
        style="width: 500px;"
      >
        <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
        <el-descriptions-item label="显示名">{{ user.display_name }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ user.mobile }}</el-descriptions-item>
        <template #extra>
          <el-button type="primary" size="small" @click="profileEditClick">修改</el-button>
        </template>
      </el-descriptions>
      <el-divider/>
    </el-card>
    <profile-edit-dialog
      v-model="dialogProfileEditShow"
      :profileEdit="profileEdit"
    ></profile-edit-dialog>
  </div>
</template>

<script setup>
import { provide, ref } from 'vue'
import ProfileEditDialog from '@/views/home/components/ProfileEditDialog.vue'
import store from '@/store'

const user = ref({})
const roles = ref([])
const menus = ref([])

const getUserProfile = async () => {
  const userProfile = store.getters.userProfile
  user.value = userProfile.user || {}
  roles.value = userProfile.roles || []
  menus.value = userProfile.menus || []
  if (roles.value.length === 0) {
    roles.value.push('未绑定角色')
  }
}

const refreshUserProfile = async () => {
  await store.dispatch('user/userProfile')
  await getUserProfile()
}
provide('refreshUserProfile', refreshUserProfile)

getUserProfile()

// 编辑
const dialogProfileEditShow = ref(false)
const profileEdit = ref({})
const profileEditClick = () => {
  profileEdit.value = user.value
  dialogProfileEditShow.value = true
}

</script>

<style lang="scss" scoped>
.profile-container {
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
