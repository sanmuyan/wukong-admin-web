<template>
  <div class="profile-container">
    <el-card>
      <h4>个人信息</h4>
      <el-divider/>
      <el-form style="width: 380px">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="user.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="显示名" label-width="100px">
          <el-input v-model="user.display_name" readonly></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="user.email" readonly></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="100px">
          <el-input v-model="user.mobile" readonly></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          <el-tag style="margin-right: 5px" v-for="item in roles" :key="item.id" type="success">{{ item }}</el-tag>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="userEditClick">修改</el-button>
      <el-divider/>
    </el-card>
    <user-edit-dialog
      v-model="dialogUserEditShow"
      :userEdit="userEdit"
    ></user-edit-dialog>
  </div>
</template>

<script setup>
import { provide, ref } from 'vue'
import UserEditDialog from './components/UserEditDialog'
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
}
provide('refreshUserProfile', refreshUserProfile)

getUserProfile()

// 编辑
const dialogUserEditShow = ref(false)
const userEdit = ref({})
const userEditClick = () => {
  userEdit.value = user.value
  dialogUserEditShow.value = true
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
