<template>
  <!--      编辑-->
  <el-dialog @close="closed" :model-value="modelValue" width="800px" draggable title="角色编辑">
    <el-checkbox-group v-model="userRoleNameList">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.role_name"></el-checkbox>
    </el-checkbox-group>
    <div class="dialog-button">
      <el-button type="primary" size="small" @click="closed">取消</el-button>
      <el-button type="primary" size="small" @click="updateUserBind">提交</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch } from 'vue'
import { restFull } from '@/api'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
const i18n = useI18n()

// 父组件传入的值
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  userId: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['update:modelValue'])

const roleList = ref([])
const userRoleNameList = ref([])
const userRoleIdList = ref([])
const userBindList = ref([])

const getRoles = async () => {
  const res = await restFull('/role', 'GET')
  roleList.value = res.roles
}

const getUserBinds = async () => {
  await getRoles()
  const res = await restFull('/userBind', 'GET', {
    user_id: props.userId
  })
  userBindList.value = res.user_binds
  // 生成默认数据
  userRoleNameList.value = []
  userBindList.value.forEach(userBind => {
    const role = roleList.value.find(role => {
      return userBind.role_id === role.id
    })
    if (role) {
      userRoleNameList.value.push(role.role_name)
    }
  })
}

watch(
  () => props.modelValue,
  val => {
    if (val) getUserBinds()
  }
)

const updateUserBind = () => {
  // 生成ID列表
  userRoleIdList.value = []
  userRoleNameList.value.forEach(roleName => {
    const role = roleList.value.find(role => {
      return role.role_name === roleName
    })
    if (role) {
      userRoleIdList.value.push(role.id)
    }
  })
  // 删除
  userBindList.value.forEach(userBind => {
    const x = userRoleIdList.value.indexOf(userBind.role_id)
    if (x === -1) {
      restFull('/userBind', 'DELETE', {
        user_id: props.userId,
        role_id: userBind.role_id
      }).then(() => {
        ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      })
    }
  })
  // 更新
  userRoleIdList.value.forEach(roleId => {
    const userBind = userBindList.value.find(userBind => {
      return userBind.role_id === roleId
    })
    if (userBind) {
      return
    }
    restFull('/userBind', 'POST', {
      user_id: props.userId,
      role_id: roleId
    }).then(() => {
      ElMessage.success('更新成功')
    })
  })
  closed()
}

const closed = () => {
  emits('update:modelValue', false)
  userRoleNameList.value = []
}

</script>

<style scoped>

</style>
