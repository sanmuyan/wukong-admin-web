<template>
  <div class="resource-container">
    <div>
      <el-input
        v-model="resourceQueryData"
        placeholder="搜索"
        class="search-input"
        style="display: inline-block; max-width:180px;"
      >
      </el-input>
      <el-button @click="resourceQuery" style="margin-left: 5px">搜索</el-button>
      <el-button @click="handleResourceCreate" style="margin-left: 5px">新增</el-button>
    </div>
    <!--    获取列表-->
    <el-card>
      <el-table :data="resourceList" border style="width: 80%">
        <el-table-column prop="resource_path" label="路径" width="180"/>
        <el-table-column prop="is_access_control" label="鉴权" width="180">
          <template #default="{ row }">
            <el-tag
              :type="row.is_auth === 1 ? 'danger' : 'success'"
              disable-transitions
            >
              {{ row.is_auth === 1 ? '鉴权' : '开放' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="comment" label="描述" width="180"/>
        <el-table-column label="操作" fixed="right" width="300">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleResourceEdit(row)">编辑</el-button>
            <el-popconfirm @confirm="deleteResource(row)" title="确定删除吗？">
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
    </el-card>
    <!--      创建-->
    <resource-create-dialog
      v-model="dialogResourceCreateShow"
    ></resource-create-dialog>
    <!--      编辑-->
    <resource-edit-dialog
      v-model="dialogResourceEditShow"
      :resourceEdit="resourceEdit"
    ></resource-edit-dialog>
  </div>
</template>

<script setup>
import { restFull } from '@/api'
import { provide, ref } from 'vue'
import { ElMessage } from 'element-plus'
import ResourceCreateDialog from './components/ResourceCreateDialog'
import ResourceEditDialog from './components/ResourceEditDialog'

// 获取列表
const resourceList = ref([])
const pageNumber = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const resourceQueryData = ref('')
const getResources = async () => {
  const res = await restFull('/resource', 'GET', {
    page_number: pageNumber.value,
    page_size: pageSize.value,
    query: resourceQueryData.value
  })
  resourceList.value = res.resources
  pageNumber.value = res.page_number
  pageSize.value = res.page_size
  totalCount.value = res.total_count
}
provide('getResources', getResources)
getResources()

const handleSizeChange = currentSize => {
  pageSize.value = currentSize
  getResources()
}

const handleCurrentChange = currentPage => {
  pageNumber.value = currentPage
  getResources()
}
// 搜索
const resourceQuery = () => {
  getResources()
}

// 编辑
const resourceEdit = ref({})
const dialogResourceEditShow = ref(false)

const handleResourceEdit = resource => {
  resourceEdit.value = resource
  dialogResourceEditShow.value = true
}

// 创建
const dialogResourceCreateShow = ref(false)

const handleResourceCreate = () => {
  dialogResourceCreateShow.value = true
}

// 删除
const deleteResource = async (resource) => {
  await restFull('/resource', 'DELETE', {
    id: resource.id
  })
    .then(() => {
      ElMessage.success('删除成功')
      getResources()
    })
}

</script>

<style lang="scss" scoped>
.resource-container {
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
