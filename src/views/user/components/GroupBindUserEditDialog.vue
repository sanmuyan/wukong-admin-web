<template>
  <!--      编辑-->
  <el-dialog @close="closed" v-model="modelValue" width="800px" draggable title="用户编辑">
    <el-transfer
      filterable
      v-model="userGroupIdList"
      :titles="['用户列表', '已加入']"
      :button-texts="['移除', '添加']"
      :props="{
      key: 'value',
      label: 'label',
    }"
      :data="userGroupOptionList"
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
const groupId = defineModel('groupId', { required: true })

const userList = ref([])
const userGroupOptionList = ref([])
const userGroupIdList = ref([])
const userGroupBindList = ref([])

const getUsers = async (parameter) => {
  if (!parameter) {
    parameter = {
      page_number: 1,
      page_size: 100
    }
  }
  await restFull('/user', 'GET', parameter)
    .then(async res => {
      userList.value.push(...res.data.users)
      if (res.data.total_count > (res.data.page_number * res.data.page_size)) {
        await getUsers({
          page_number: res.data.page_number + 1,
          page_size: res.data.page_size
        })
      }
    })
}

const getUserGroupBinds = async () => {
  await getUsers()
  await restFull('/userGroupBind', 'GET', {
    group_id: groupId.value,
    page_size: 100
  }).then(res => {
    userGroupBindList.value = res.data.user_group_binds
    // 生成默认数据
    userList.value.forEach(user => {
      userGroupOptionList.value.push({
        value: user.id,
        label: user.display_name ? user.username + '(' + user.display_name + ')' : user.username
      })
      const userGroupBind = userGroupBindList.value.find(userGroupBind => {
        return userGroupBind.user_id === user.id
      })
      if (userGroupBind) {
        userGroupIdList.value.push(user.id)
      }
    })
  })
}

watch(
  () => modelValue.value,
  val => {
    if (val) getUserGroupBinds()
  }
)

const updateUserGroupBind = () => {
  // 删除
  const deleteUserGroupBindList = []
  userGroupBindList.value.forEach(userGroupBind => {
    const x = userGroupIdList.value.indexOf(userGroupBind.group_id)
    if (x === -1) {
      deleteUserGroupBindList.push({ id: userGroupBind.id })
    }
  })
  if (deleteUserGroupBindList.length > 0) {
    restFull('/userGroupBind', 'DELETE', deleteUserGroupBindList)
      .then(() => {
        ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      })
  }
  // 创建
  const createUserGroupBindList = []
  userGroupIdList.value.forEach(userId => {
    const userGroupBind = userGroupBindList.value.find(userGroupBind => {
      return userGroupBind.user_id === userId
    })
    if (userGroupBind) {
      return
    }
    createUserGroupBindList.push({
      user_id: userId,
      group_id: groupId.value
    })
  })
  if (createUserGroupBindList.length > 0) {
    restFull('/userGroupBind', 'POST', createUserGroupBindList)
      .then(() => {
        ElMessage.success('更新成功')
      })
  }
  closed()
}

const handleButtonSubmit = () => {
  updateUserGroupBind()
}

const handleButtonCancel = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  userList.value = []
  userGroupIdList.value = []
  userGroupOptionList.value = []
}

</script>

<style scoped>

</style>
