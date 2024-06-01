<template>
  <!--      编辑-->
  <el-dialog @close="closed" v-model="modelValue" width="800px" draggable title="角色编辑">
    <el-transfer
      v-model="userRoleIdList"
      :titles="['角色列表', '已授权']"
      :button-texts="['移除', '添加']"
      :props="{
      key: 'value',
      label: 'label',
    }"
      :data="userRoleOptionList"
    />
    <div class="dialog-button">
      <el-button type="primary" size="small" @click="closed">取消</el-button>
      <el-button type="primary" size="small" @click="updateUserBind">提交</el-button>
    </div>
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
const userBindList = ref([])

const getRoles = async () => {
  const res = await restFull('/role', 'GET')
  roleList.value = res.roles
}

const getUserBinds = async () => {
  await getRoles()
  const res = await restFull('/userBind', 'GET', {
    user_id: userId.value
  })
  userBindList.value = res.user_binds
  // 生成默认数据
  roleList.value.forEach(role => {
    userRoleOptionList.value.push({
      value: role.id,
      label: role.role_name
    })
    const userBind = userBindList.value.find(userBind => {
      return userBind.role_id === role.id
    })
    if (userBind) {
      userRoleIdList.value.push(role.id)
    }
  })
}

watch(
  () => modelValue.value,
  val => {
    if (val) getUserBinds()
  }
)

const updateUserBind = () => {
  // 删除
  const deleteUserBindList = []
  userBindList.value.forEach(userBind => {
    const x = userRoleIdList.value.indexOf(userBind.role_id)
    if (x === -1) {
      deleteUserBindList.push({ id: userBind.id })
    }
  })
  if (deleteUserBindList.length > 0) {
    restFull('/userBind', 'DELETE', deleteUserBindList).then(() => {
      ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
    })
  }
  // 创建
  const createUserBindList = []
  userRoleIdList.value.forEach(roleId => {
    const userBind = userBindList.value.find(userBind => {
      return userBind.role_id === roleId
    })
    if (userBind) {
      return
    }
    createUserBindList.push({
      user_id: userId.value,
      role_id: roleId
    })
  })
  if (createUserBindList.length > 0) {
    restFull('/userBind', 'POST', createUserBindList).then(() => {
      ElMessage.success('更新成功')
    })
  }
  closed()
}

const closed = () => {
  modelValue.value = false
  userRoleIdList.value = []
  userRoleOptionList.value = []
}

</script>

<style scoped>

</style>
