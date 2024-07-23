<template>
  <!--      编辑-->
  <el-dialog @close="closed" v-model="modelValue" width="800px" draggable title="角色编辑">
    <el-transfer
      filterable
      v-model="groupRoleIdList"
      :titles="['角色列表', '已授权']"
      :button-texts="['移除', '添加']"
      :props="{
      key: 'value',
      label: 'label',
    }"
      :data="groupRoleOptionList"
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

const roleList = ref([])
const groupRoleOptionList = ref([])
const groupRoleIdList = ref([])
const groupRoleBindList = ref([])

const getRoles = async (parameter) => {
  await restFull('/role', 'GET', { page_size: 100 })
    .then(async res => {
      roleList.value = res.data.roles
    })
}

const getGroupRoleBinds = async (parameter) => {
  await getRoles()
  await restFull('/groupRoleBind', 'GET', {
    group_id: groupId.value,
    page_size: 100
  }).then(res => {
    groupRoleBindList.value = res.data.group_role_binds
    // 生成默认数据
    roleList.value.forEach(role => {
      groupRoleOptionList.value.push({
        value: role.id,
        label: role.comment ? role.role_name + '(' + role.comment + ')' : role.role_name
      })
      const groupRoleBind = groupRoleBindList.value.find(groupRoleBind => {
        return groupRoleBind.role_id === role.id
      })
      if (groupRoleBind) {
        groupRoleIdList.value.push(role.id)
      }
    })
  })
}

watch(
  () => modelValue.value,
  val => {
    if (val) getGroupRoleBinds()
  }
)

const updateGroupRoleBind = () => {
  // 删除
  const deleteGroupRoleBindList = []
  groupRoleBindList.value.forEach(groupRoleBind => {
    const x = groupRoleIdList.value.indexOf(groupRoleBind.role_id)
    if (x === -1) {
      deleteGroupRoleBindList.push({ id: groupRoleBind.id })
    }
  })
  if (deleteGroupRoleBindList.length > 0) {
    restFull('/groupRoleBind', 'DELETE', deleteGroupRoleBindList)
      .then(() => {
        ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      })
  }
  // 创建
  const createGroupRoleBindList = []
  groupRoleIdList.value.forEach(roleId => {
    const groupRoleBind = groupRoleBindList.value.find(groupRoleBind => {
      return groupRoleBind.role_id === roleId
    })
    if (groupRoleBind) {
      return
    }
    createGroupRoleBindList.push({
      group_id: groupId.value,
      role_id: roleId
    })
  })
  if (createGroupRoleBindList.length > 0) {
    restFull('/groupRoleBind', 'POST', createGroupRoleBindList)
      .then(() => {
        ElMessage.success('更新成功')
      })
  }
  closed()
}

const handleButtonSubmit = () => {
  updateGroupRoleBind()
}

const handleButtonCancel = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  roleList.value = []
  groupRoleIdList.value = []
  groupRoleOptionList.value = []
}

</script>

<style scoped>

</style>
