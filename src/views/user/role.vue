<template>
  <div class="role-container">
    <div>
      <el-input
        v-model="roleQueryData"
        placeholder="搜索"
        class="search-input"
        style="display: inline-block; max-width:180px;"
      >
      </el-input>
      <el-button @click="roleQuery" style="margin-left: 5px">搜索</el-button>
      <el-button @click="handleRoleCreate" style="margin-left: 5px">新增</el-button>
    </div>
    <!--    获取列表-->
    <el-card>
      <el-table :data="roleList" style="width: 80%">
        <el-table-column prop="role_name" label="角色名"/>
        <el-table-column prop="access_level" label="角色等级"/>
        <el-table-column prop="comment" label="描述"/>
        <el-table-column label="操作" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleRoleEdit(row)">编辑</el-button>
            <el-button type="primary" size="small" @click="handleResourceEdit(row)">权限</el-button>
            <el-popconfirm @confirm="deleteRole(row)" title="确定删除吗？">
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
      <role-edit-dialog
        v-model="dialogRoleEditShow"
        :roleEdit="roleEdit"
      ></role-edit-dialog>
      <!--      创建-->
      <role-create-dialog
        v-model="dialogRoleCreateShow"
      ></role-create-dialog>
      <!--      权限编辑-->
      <role-bind-edit-dialog
        v-model="dialogRoleShow"
        :roleId="roleResourceId"
      ></role-bind-edit-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { restFull } from '@/api'
import { provide, ref } from 'vue'
import { ElMessage } from 'element-plus'
import RoleEditDialog from './components/RoleEditDialog'
import RoleCreateDialog from './components/RoleCreateDialog'
import RoleBindEditDialog from './components/RoleBindEditDialog'

// 获取列表
const roleList = ref([])
const pageNumber = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const roleQueryData = ref('')
const getRoles = async () => {
  await restFull('/role', 'GET', {
    page_number: pageNumber.value,
    page_size: pageSize.value,
    query: roleQueryData.value
  }).then(res => {
    roleList.value = res.data.roles
    pageNumber.value = res.data.page_number
    pageSize.value = res.data.page_size
    totalCount.value = res.data.total_count
  })
}
provide('getRoles', getRoles)
getRoles()

const handleSizeChange = currentSize => {
  pageSize.value = currentSize
  getRoles()
}

const handleCurrentChange = currentPage => {
  pageNumber.value = currentPage
  getRoles()
}
// 搜索
const roleQuery = () => {
  getRoles()
}

// 编辑
const roleEdit = ref({})
const dialogRoleEditShow = ref(false)

const handleRoleEdit = role => {
  roleEdit.value = role
  dialogRoleEditShow.value = true
}

// 创建
const dialogRoleCreateShow = ref(false)

const handleRoleCreate = () => {
  dialogRoleCreateShow.value = true
}

// 删除
const deleteRole = async (role) => {
  await restFull('/role', 'DELETE', {
    id: role.id
  })
    .then(() => {
      dialogRoleEditShow.value = false
      ElMessage.success('删除成功')
      getRoles()
    })
}

// 编辑权限
const dialogRoleShow = ref(false)
const roleResourceId = ref(0)
const handleResourceEdit = (role) => {
  dialogRoleShow.value = true
  roleResourceId.value = role.id
}

</script>

<style lang="scss" scoped>
.role-container {
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
