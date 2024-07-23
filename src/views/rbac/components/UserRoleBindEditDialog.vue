<template>
  <!--      编辑-->
  <el-dialog @close="closed" v-model="modelValue" width="800px" draggable title="角色编辑">
    <el-transfer
      filterable
      v-model="userRoleIdList"
      :titles="['角色列表', '已授权']"
      :button-texts="['移除', '添加']"
      :props="{
      key: 'value',
      label: 'label',
    }"
      :data="userRoleOptionList"
    />
    <template #footer>
      <el-button type="primary" size="small" @click="handleButtonCancel">取消</el-button>
      <el-button type="primary" size="small" @click="handleButtonSubmit">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineModel, ref, watch } from 'vue'
import { restFull } from '@/api'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

// 父组件传入的值
const modelValue = defineModel({ required: true })
const userId = defineModel('userId', { required: true })

const roleList = ref([])
const userRoleOptionList = ref([])
const userRoleIdList = ref([])
const userRoleBindList = ref([])

const getRoles = async (parameter) => {
  await restFull('/role', 'GET', { page_size: 100 })
    .then(async res => {
      roleList.value = res.data.roles
      if (res.data.total_count > (res.data.page_number * res.data.page_size)) {
        await getRoles({
          page_number: res.data.page_number + 1,
          page_size: res.data.page_size
        })
      }
    })
}

const getUserRoleBinds = async () => {
  await getRoles()
  await restFull('/userRoleBind', 'GET', {
    user_id: userId.value,
    page_size: 100
  }).then(res => {
    userRoleBindList.value = res.data.user_role_binds
    // 生成默认数据
    roleList.value.forEach(role => {
      userRoleOptionList.value.push({
        value: role.id,
        label: role.comment ? role.role_name + '(' + role.comment + ')' : role.role_name
      })
      const userRoleBind = userRoleBindList.value.find(userRoleBind => {
        return userRoleBind.role_id === role.id
      })
      if (userRoleBind) {
        userRoleIdList.value.push(role.id)
      }
    })
  })
}

watch(
  () => modelValue.value,
  val => {
    if (val) getUserRoleBinds()
  }
)

const updateUserRoleBind = () => {
  // 删除
  const deleteUserRoleBindList = []
  userRoleBindList.value.forEach(userRoleBind => {
    const x = userRoleIdList.value.indexOf(userRoleBind.role_id)
    if (x === -1) {
      deleteUserRoleBindList.push({ id: userRoleBind.id })
    }
  })
  if (deleteUserRoleBindList.length > 0) {
    restFull('/userRoleBind', 'DELETE', deleteUserRoleBindList)
      .then(() => {
        ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      })
  }
  // 创建
  const createUserRoleBindList = []
  userRoleIdList.value.forEach(roleId => {
    const userRoleBind = userRoleBindList.value.find(userRoleBind => {
      return userRoleBind.role_id === roleId
    })
    if (userRoleBind) {
      return
    }
    createUserRoleBindList.push({
      user_id: userId.value,
      role_id: roleId
    })
  })
  if (createUserRoleBindList.length > 0) {
    restFull('/userRoleBind', 'POST', createUserRoleBindList)
      .then(() => {
        ElMessage.success('更新成功')
      })
  }
  closed()
}

const handleButtonSubmit = () => {
  updateUserRoleBind()
}

const handleButtonCancel = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  roleList.value = []
  userRoleIdList.value = []
  userRoleOptionList.value = []
}

</script>

<style scoped>

</style>
