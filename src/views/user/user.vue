<template>
  <div class="user-container">
    <div>
      <el-input
        v-model="userQueryData"
        placeholder="搜索"
        class="search-input"
        style="display: inline-block; max-width:180px;"
      >
      </el-input>
      <el-button @click="handleUserQuery" style="margin-left: 5px">搜索</el-button>
      <el-button @click="userCreateClick" style="margin-left: 5px">新增</el-button>
    </div>
    <!--    获取列表-->
    <el-card>
      <el-table :data="userList" style="width: 80%" v-loading="loading">
        <el-table-column prop="username" label="用户名"/>
        <el-table-column prop="display_name" label="显示名"/>
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="手机号"/>
        <el-table-column prop="is_access_control" label="用户状态">
          <template #default="{ row }">
            <el-tag
              :type="row.is_active === 1 ? 'success' : 'danger'"
              disable-transitions
            >
              {{ row.is_active === 1 ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300px">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleUserEdit(row)">编辑</el-button>
            <el-button type="primary" size="small" @click="handleRoleEdit(row)">角色</el-button>
            <el-button type="primary" size="small" @click="handleGroupEdit(row)">用户组</el-button>
            <el-popconfirm @confirm="deleteUser(row)" title="确定删除吗？">
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
      <user-edit-dialog
        v-model="dialogUserEditShow"
        :userEdit="userEdit"
      ></user-edit-dialog>
      <!--      创建-->
      <user-create-dialog
        v-model="dialogUserCreateShow"
      ></user-create-dialog>
      <!--      角色编辑-->
      <user-role-bind-edit-dialog
        v-model="showUserRoleBindDialog"
        :userId="nowUserId"
      ></user-role-bind-edit-dialog>
      <!--      组编辑-->
      <user-bind-group-edit-dialog
        v-model="showUserBindGroupDialog"
        :userId="nowUserId"
      ></user-bind-group-edit-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { restFull } from '@/api'
import { provide, ref } from 'vue'
import { ElMessage } from 'element-plus'
import UserEditDialog from './components/UserEditDialog'
import UserRoleBindEditDialog from '../rbac/components/UserRoleBindEditDialog.vue'
import UserCreateDialog from './components/UserCreateDialog'
import UserBindGroupEditDialog from '@/views/user/components/UserBindGroupEditDialog.vue'

// 获取列表
const userList = ref([])
const pageNumber = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const userQueryData = ref('')
const loading = ref(false)
const nowUserId = ref(0)
const getUsers = async () => {
  loading.value = true
  await restFull('/user', 'GET', {
    page_number: pageNumber.value,
    page_size: pageSize.value,
    query: userQueryData.value
  }).then(res => {
    userList.value = res.data.users
    pageNumber.value = res.data.page_number
    pageSize.value = res.data.page_size
    totalCount.value = res.data.total_count
  })
  loading.value = false
}
provide('getUsers', getUsers)
getUsers()

const handleSizeChange = currentSize => {
  pageSize.value = currentSize
  getUsers()
}

const handleCurrentChange = currentPage => {
  pageNumber.value = currentPage
  getUsers()
}
// 搜索
const handleUserQuery = () => {
  getUsers()
}

// 编辑
const userEdit = ref({})
const dialogUserEditShow = ref(false)
const handleUserEdit = user => {
  userEdit.value = user
  dialogUserEditShow.value = true
}

// 创建
const dialogUserCreateShow = ref(false)
const userCreateClick = () => {
  dialogUserCreateShow.value = true
}

// 删除
const deleteUser = async (user) => {
  await restFull('/user', 'DELETE', {
    id: user.id
  })
    .then(() => {
      ElMessage.success('删除成功')
      getUsers()
    })
}

// 编辑角色
const showUserRoleBindDialog = ref(false)
const handleRoleEdit = (user) => {
  nowUserId.value = user.id
  showUserRoleBindDialog.value = true
}

// 编辑用户组
const showUserBindGroupDialog = ref(false)
const handleGroupEdit = (user) => {
  nowUserId.value = user.id
  showUserBindGroupDialog.value = true
}

</script>

<style lang="scss" scoped>
.user-container {
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
