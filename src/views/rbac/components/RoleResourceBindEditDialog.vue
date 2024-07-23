<template>
  <!--      编辑-->
  <el-dialog @close="closed" v-model="modelValue" width="1000px" draggable title="权限编辑">
    <el-transfer
      class="el-transfer"
      filterable
      v-model="roleResourceIdList"
      :titles="['资源列表', '已授权']"
      :button-texts="['移除', '添加']"
      :props="{
      key: 'value',
      label: 'label',
    }"
      :data="roleResourceOptionList"
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
const roleId = defineModel('roleId', { required: true })

const resourceList = ref([])
const roleResourceOptionList = ref([])
const roleResourceIdList = ref([])
const roleResourceBindList = ref([])

const getResources = async (parameter) => {
  if (!parameter) {
    parameter = {
      page_number: 1,
      page_size: 100
    }
  }
  await restFull('/resource', 'GET', parameter)
    .then(async res => {
      resourceList.value.push(...res.data.resources)
      if (res.data.total_count > (res.data.page_number * res.data.page_size)) {
        await getResources({
          page_number: res.data.page_number + 1,
          page_size: res.data.page_size
        })
      }
    })
}

const getRoleResourceBinds = async (parameter) => {
  if (!parameter) {
    parameter = {
      page_number: 1,
      page_size: 100
    }
  }
  parameter.role_id = roleId.value
  await restFull('/roleResourceBind', 'GET', parameter)
    .then(async res => {
      roleResourceBindList.value = res.data.role_resource_binds
      // 生成默认数据
      for (const resource of resourceList.value) {
        if (resource.is_auth === 1) {
          roleResourceOptionList.value.push({
            value: resource.id,
            label: resource.comment ? resource.resource_path + '(' + resource.comment + ')' : resource.resource_path
          })
        }
        const roleResourceBind = roleResourceBindList.value.find(roleResourceBind => {
          return roleResourceBind.resource_id === resource.id
        })
        if (roleResourceBind) {
          roleResourceIdList.value.push(resource.id)
        }
        if (res.data.total_count > (res.data.page_number * res.data.page_size)) {
          await getRoleResourceBinds({
            page_number: res.data.page_number + 1,
            page_size: res.data.page_size
          })
        }
      }
    })
}

watch(
  () => modelValue.value,
  async val => {
    if (val) {
      await getResources()
      await getRoleResourceBinds()
    }
  }
)

const updateRoleResourceBind = () => {
  // 删除
  const deleteRoleResourceBindList = []
  roleResourceBindList.value.forEach(roleResourceBind => {
    const x = roleResourceIdList.value.indexOf(roleResourceBind.resource_id)
    if (x === -1) {
      deleteRoleResourceBindList.push({ id: roleResourceBind.id })
    }
  })
  if (deleteRoleResourceBindList.length > 0) {
    restFull('/roleResourceBind', 'DELETE', deleteRoleResourceBindList)
      .then(() => {
        ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      })
  }
  // 创建
  const createRoleResourceBindList = []
  roleResourceIdList.value.forEach(resourceId => {
    const roleResourceBind = roleResourceBindList.value.find(roleResourceBind => {
      return roleResourceBind.resource_id === resourceId
    })
    if (roleResourceBind) {
      return
    }
    createRoleResourceBindList.push({
      resource_id: resourceId,
      role_id: roleId.value
    })
  })
  if (createRoleResourceBindList.length > 0) {
    restFull('/roleResourceBind', 'POST', createRoleResourceBindList)
      .then(() => {
        ElMessage.success(i18n.t('msg.appMain.updateSuccess'))
      })
  }
  closed()
}

const handleButtonSubmit = () => {
  updateRoleResourceBind()
}

const handleButtonCancel = () => {
  closed()
}

const closed = () => {
  modelValue.value = false
  resourceList.value = []
  roleResourceBindList.value = []
  roleResourceIdList.value = []
  roleResourceOptionList.value = []
}

</script>

<style scoped>
.el-transfer {
  --el-transfer-panel-width: 350px;
}
</style>
