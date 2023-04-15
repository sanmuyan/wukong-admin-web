<template>
  <!--      编辑-->
  <el-dialog @close="closed" :model-value="modelValue" width="800px" draggable title="权限编辑">
    <el-transfer
      v-model="roleResourceIdList"
      :titles="['资源列表', '已授权']"
      :button-texts="['移除', '添加']"
      :props="{
      key: 'value',
      label: 'label',
    }"
      :data="roleResourceOptionList"
    />
    <div class="dialog-button">
      <el-button type="primary" size="small" @click="closed">取消</el-button>
      <el-button type="primary" size="small" @click="updateRoleBind">提交</el-button>
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
  roleId: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['update:modelValue'])

const resourceList = ref([])
const roleResourceOptionList = ref([])
const roleResourceIdList = ref([])
const roleBindList = ref([])

const getResources = async () => {
  const res = await restFull('/resource', 'GET')
  resourceList.value = res.resources
}

const getRoleBinds = async () => {
  await getResources()
  const res = await restFull('/roleBind', 'GET', {
    role_id: props.roleId
  })
  roleBindList.value = res.role_binds
  // 生成默认数据
  resourceList.value.forEach(resource => {
    if (resource.is_auth === 1) {
      roleResourceOptionList.value.push({
        value: resource.id,
        label: resource.resource_path
      })
    }
    const roleBind = roleBindList.value.find(roleBind => {
      return roleBind.resource_id === resource.id
    })
    if (roleBind) {
      roleResourceIdList.value.push(resource.id)
    }
  })
}

watch(
  () => props.modelValue,
  val => {
    if (val) getRoleBinds()
  }
)

const updateRoleBind = () => {
  // 删除
  roleBindList.value.forEach(roleBind => {
    const x = roleResourceIdList.value.indexOf(roleBind.resource_id)
    if (x === -1) {
      restFull('/roleBind', 'DELETE', {
        id: roleBind.id
      }).then(() => {
        ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      })
    }
  })
  // 更新
  roleResourceIdList.value.forEach(resourceId => {
    const roleBind = roleBindList.value.find(roleBind => {
      return roleBind.resource_id === resourceId
    })
    if (roleBind) {
      return
    }
    restFull('/roleBind', 'POST', {
      resource_id: resourceId,
      role_id: props.roleId
    }).then(() => {
      ElMessage.success('更新成功')
    })
  })
  closed()
}

const closed = () => {
  emits('update:modelValue', false)
  roleResourceIdList.value = []
  roleResourceOptionList.value = []
}

</script>

<style scoped>

</style>
