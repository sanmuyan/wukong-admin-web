<template>
  <el-drawer v-model="modelValue">
    <el-table :data="passKeys">
      <el-table-column type="expand">
        <template #default="{ row }">
          <el-descriptions
            :column="1"
            direction="vertical"
            border
          >
            <el-descriptions-item label="创建时间">{{ row.created_at }}</el-descriptions-item>
            <el-descriptions-item label="最后使用时间">{{ row.last_used_at }}</el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column prop="display_name" label="名称" width="150"/>
      <el-table-column label="操作" fixed="right" width="200">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handlePassKeyEdit(row)">编辑</el-button>
          <el-popconfirm @confirm="handleDeletePassKey(row)" title="确定删除吗？">
            <template #reference>
              <el-button type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
  <pass-key-edit-dialog
    v-model="showPassKeyEditDialog"
    :passKeyEdit="passKeyEdit"
  ></pass-key-edit-dialog>
</template>

<script setup>
import { defineModel, provide, ref, watch } from 'vue'
import { restFull } from '@/api'
import PassKeyEditDialog from './PassKeyEditDialog.vue'

// 父组件传入的值
const modelValue = defineModel({ required: true })

const passKeys = ref([])
const getPassKeys = async () => {
  await restFull('/profile/passKeys', 'GET')
    .then(res => {
      passKeys.value = res.pass_keys
      passKeys.value.forEach(item => {
        item.created_at = new Date(item.created_at).toLocaleString()
        item.last_used_at = new Date(item.last_used_at).toLocaleString()
      })
    })
}

provide('getPassKeys', getPassKeys)
getPassKeys()

watch(modelValue, () => {
  if (modelValue.value) {
    getPassKeys()
  }
})

const showPassKeyEditDialog = ref(false)
const passKeyEdit = ref({})
const handlePassKeyEdit = async (row) => {
  showPassKeyEditDialog.value = true
  passKeyEdit.value = row
}

const handleDeletePassKey = async (row) => {
  restFull('/profile/passKey', 'DELETE', { id: row.id })
    .then(() => {
      getPassKeys()
    })
}

</script>

<style scoped lang="scss">

</style>
