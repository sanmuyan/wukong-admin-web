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
const userBindList = ref([])

const getRoles = async (parameter) => {
  if (!parameter) {
    parameter = {
      page_number: 1,
      page_size: 10
    }
  }
  await restFull('/role', 'GET', parameter)
    .then(async res => {
      res.data.roles.forEach(item => {
        roleList.value.push(item)
      })
      if (res.data.total_count > (res.data.page_number * res.data.page_size)) {
        await getRoles({
          page_number: res.data.page_number + 1,
          page_size: res.data.page_size
        })
      }
    })
}

const getUserBinds = async () => {
  await getRoles()
  await restFull('/userBind', 'GET', {
    user_id: userId.value
  }).then(res => {
    userBindList.value = res.data.user_binds
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
    restFull('/userBind', 'DELETE', deleteUserBindList)
      .then(() => {
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
    restFull('/userBind', 'POST', createUserBindList)
      .then(() => {
        ElMessage.success('更新成功')
      })
  }
  closed()
}

const handleButtonSubmit = () => {
  updateUserBind()
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
