<template>
  <!--      编辑-->
  <el-dialog @close="closed" v-model="modelValue" width="800px" draggable title="加入组">
    <el-transfer
      filterable
      v-model="userGroupIdList"
      :titles="['组列表', '已加入']"
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
const userId = defineModel('userId', { required: true })

const groupList = ref([])
const userGroupOptionList = ref([])
const userGroupIdList = ref([])
const userGroupBindList = ref([])

const getGroups = async () => {
  await restFull('/group', 'GET', { page_size: 100 })
    .then(res => {
      groupList.value = res.data.groups
    })
}

const getUserUserGroupBinds = async () => {
  await getGroups()
  await restFull('/userGroupBind', 'GET', {
    user_id: userId.value
  }).then(res => {
    userGroupBindList.value = res.data.user_group_binds
    // 生成默认数据
    groupList.value.forEach(group => {
      userGroupOptionList.value.push({
        value: group.id,
        label: group.display_name ? group.group_name + '(' + group.display_name + ')' : group.group_name
      })
      const userGroupBind = userGroupBindList.value.find(userGroupBind => {
        return userGroupBind.group_id === group.id
      })
      if (userGroupBind) {
        userGroupIdList.value.push(group.id)
      }
    })
  })
}

watch(
  () => modelValue.value,
  val => {
    if (val) getUserUserGroupBinds()
  }
)

const updateUserUserGroupBind = () => {
  // 删除
  const deleteUserUserGroupBindList = []
  userGroupBindList.value.forEach(userGroupBind => {
    const x = userGroupIdList.value.indexOf(userGroupBind.group_id)
    if (x === -1) {
      deleteUserUserGroupBindList.push({ id: userGroupBind.id })
    }
  })
  if (deleteUserUserGroupBindList.length > 0) {
    restFull('/userGroupBind', 'DELETE', deleteUserUserGroupBindList)
      .then(() => {
        ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      })
  }
  // 创建
  const createUserUserGroupBindList = []
  userGroupIdList.value.forEach(groupId => {
    const userGroupBind = userGroupBindList.value.find(userGroupBind => {
      return userGroupBind.group_id === groupId
    })
    if (userGroupBind) {
      return
    }
    createUserUserGroupBindList.push({
      user_id: userId.value,
      group_id: groupId
    })
  })
  if (createUserUserGroupBindList.length > 0) {
    restFull('/userGroupBind', 'POST', createUserUserGroupBindList)
      .then(() => {
        ElMessage.success('更新成功')
      })
  }
  closed()
}

const handleButtonSubmit = () => {
  updateUserUserGroupBind()
}

const handleButtonCancel = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  groupList.value = []
  userGroupIdList.value = []
  userGroupOptionList.value = []
}

</script>

<style scoped>

</style>
