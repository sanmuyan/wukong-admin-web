<template>
  <div class="group-container">
    <div>
      <el-input
        v-model="groupQueryData"
        placeholder="搜索"
        class="search-input"
        style="display: inline-block; max-width:180px;"
      >
      </el-input>
      <el-button @click="handleGroupQuery" style="margin-left: 5px">搜索</el-button>
      <el-button @click="groupCreateClick" style="margin-left: 5px">新增</el-button>
    </div>
    <!--    获取列表-->
    <el-card>
      <el-table :data="groupList" style="width: 80%" v-loading="loading">
        <el-table-column prop="group_name" label="组名"/>
        <el-table-column prop="display_name" label="显示名"/>
        <el-table-column label="操作" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleGroupEdit(row)">编辑</el-button>
            <el-button type="primary" size="small" @click="handleRoleEdit(row)">角色</el-button>
            <el-button type="primary" size="small" @click="handleUserEdit(row)">用户</el-button>
            <el-popconfirm @confirm="deleteGroup(row)" title="确定删除吗？">
              <template #reference>
                <el-button type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
        >
      </el-table>
      <!--      分页器-->
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
      <!--      编辑-->
      <group-edit-dialog
        v-model="dialogGroupEditShow"
        :groupEdit="groupEdit"
      ></group-edit-dialog>
      <!--      创建-->
      <group-create-dialog
        v-model="dialogGroupCreateShow"
      ></group-create-dialog>
      <!--      角色编辑-->
      <group-role-bind-edit-dialog
        v-model="showGroupRoleBindDialog"
        :groupId="nowGroupId"
      ></group-role-bind-edit-dialog>
      <!--      用户编辑-->
      <group-bind-user-edit-dialog
        v-model="showGroupBindUserDialog"
        :groupId="nowGroupId"
      ></group-bind-user-edit-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { restFull } from '@/api'
import { provide, ref } from 'vue'
import { ElMessage } from 'element-plus'
import GroupEditDialog from './components/GroupEditDialog'
import GroupBindUserEditDialog from './components/GroupBindUserEditDialog.vue'
import GroupCreateDialog from './components/GroupCreateDialog'
import GroupRoleBindEditDialog from '@/views/rbac/components/GroupRoleBindEditDialog.vue'

// 获取列表
const groupList = ref([])
const pageNumber = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const groupQueryData = ref('')
const loading = ref(false)
const nowGroupId = ref(0)
const getGroups = async () => {
  loading.value = true
  await restFull('/group', 'GET', {
    page_number: pageNumber.value,
    page_size: pageSize.value,
    query: groupQueryData.value
  }).then(res => {
    groupList.value = res.data.groups
    pageNumber.value = res.data.page_number
    pageSize.value = res.data.page_size
    totalCount.value = res.data.total_count
  })
  loading.value = false
}
provide('getGroups', getGroups)
getGroups()

const handleSizeChange = currentSize => {
  pageSize.value = currentSize
  getGroups()
}

const handleCurrentChange = currentPage => {
  pageNumber.value = currentPage
  getGroups()
}
// 搜索
const handleGroupQuery = () => {
  getGroups()
}

// 编辑
const groupEdit = ref({})
const dialogGroupEditShow = ref(false)
const handleGroupEdit = group => {
  groupEdit.value = group
  dialogGroupEditShow.value = true
}

// 创建
const dialogGroupCreateShow = ref(false)
const groupCreateClick = () => {
  dialogGroupCreateShow.value = true
}

// 删除
const deleteGroup = async (group) => {
  await restFull('/group', 'DELETE', {
    id: group.id
  })
    .then(() => {
      ElMessage.success('删除成功')
      getGroups()
    })
}
// 编辑角色
const showGroupRoleBindDialog = ref(false)
const handleRoleEdit = (group) => {
  nowGroupId.value = group.id
  showGroupRoleBindDialog.value = true
}

// 用户编辑
const showGroupBindUserDialog = ref(false)
const handleUserEdit = (group) => {
  nowGroupId.value = group.id
  showGroupBindUserDialog.value = true
}

</script>

<style lang="scss" scoped>
.group-container {
  .header {
    margin-bottom: 22px;
    text-align: right;
  }
  .pagination {
    margin-top: 20px;
    text-align: center;
  }
  :deep .dialog-button {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
