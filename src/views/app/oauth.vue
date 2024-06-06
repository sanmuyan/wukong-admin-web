<template>
  <div class="oauth-app-container">
    <div>
      <el-input
        v-model="oauthAppQueryData"
        placeholder="搜索"
        class="search-input"
        style="display: inline-block; max-width:180px;"
      >
      </el-input>
      <el-button @click="oauthAppsQuery" style="margin-left: 5px">搜索</el-button>
      <el-button @click="handleOauthAppCreate" style="margin-left: 5px">新增</el-button>
    </div>
    <!--    获取列表-->
    <el-card>
      <el-table :data="oauthAppList" style="width: 80%">
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="table-show-container">
              <div>应用 ID</div>
              <span>{{ row.client_id }}</span>
              <div>应用密钥</div>
              <span>{{ row.client_secret }}</span>
              <div>重定向 URI</div>
              <ul v-if="row.redirect_uri_list">
                <li v-for="item in row.redirect_uri_list" :key="item">
                  {{ item }}
                </li>
              </ul>
              <div>Scope</div>
              <ul v-if="row.scope_list">
                <li v-for="item in row.scope_list" :key="item">
                  {{ item }}
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="app_name" label="应用名称" width="180"/>
        <el-table-column prop="comment" label="描述" width="180"/>
        <el-table-column label="操作" fixed="right" width="300">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleOauthAppEdit(row)">编辑</el-button>
            <el-popconfirm @confirm="deleteOauthApp(row)" title="确定删除吗？">
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
      <Oauth-app-edit-dialog
        v-model="dialogOauthAppEditShow"
        :oauthAppEdit="oauthAppEdit"
      ></Oauth-app-edit-dialog>
      <!--      创建-->
      <Oauth-app-create-dialog
        v-model="dialogOauthAppCreateShow"
      ></Oauth-app-create-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { restFull } from '@/api'
import { provide, ref } from 'vue'
import { ElMessage } from 'element-plus'
import OauthAppEditDialog from './components/OauthAppEditDialog'
import OauthAppCreateDialog from './components/OauthAppCreateDialog'

// 获取列表
const oauthAppList = ref([])
const pageNumber = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)
const oauthAppQueryData = ref('')

const getOauthApps = async () => {
  const res = await restFull('/oauth/app', 'GET', {
    page_number: pageNumber.value,
    page_size: pageSize.value,
    query: oauthAppQueryData.value
  })
  if (res.oauth_apps) {
    oauthAppList.value = res.oauth_apps
    oauthAppList.value.forEach(oauthApp => {
      if (oauthApp.redirect_uri) {
        oauthApp.redirect_uri = oauthApp.redirect_uri.replace(/,/g, '\n')
        oauthApp.redirect_uri_list = oauthApp.redirect_uri.split('\n')
      }
      if (oauthApp.scope) {
        oauthApp.scope = oauthApp.scope.replace(/,/g, '\n')
        oauthApp.scope_list = oauthApp.scope.split('\n')
      }
    })
  }
  pageNumber.value = res.page_number
  pageSize.value = res.page_size
  totalCount.value = res.total_count
}
provide('getOauthApps', getOauthApps)
getOauthApps()

const handleSizeChange = currentSize => {
  pageSize.value = currentSize
  getOauthApps()
}

const handleCurrentChange = currentPage => {
  pageNumber.value = currentPage
  getOauthApps()
}
// 搜索
const oauthAppsQuery = () => {
  getOauthApps()
}

// 编辑
const oauthAppEdit = ref({})
const dialogOauthAppEditShow = ref(false)

const handleOauthAppEdit = oauthApp => {
  oauthAppEdit.value = oauthApp
  dialogOauthAppEditShow.value = true
}

// 创建
const dialogOauthAppCreateShow = ref(false)

const handleOauthAppCreate = () => {
  dialogOauthAppCreateShow.value = true
}

// 删除
const deleteOauthApp = async (oauthApp) => {
  await restFull('/oauth/app', 'DELETE', {
    id: oauthApp.id
  })
    .then(() => {
      dialogOauthAppEditShow.value = false
      ElMessage.success('删除成功')
      getOauthApps()
    })
}

</script>

<style lang="scss" scoped>
.oauth-app-container {
  .table-show-container {
    font-size: 14px;
    text-align: left;
    display: flex;
    flex-direction: column;
    grid-gap: 10px;

    div {
      color: rgb(155, 158, 160);
    }

    ul {
      list-style-type: disc;
      padding-left: 20px;
    }
    ul li {
      margin-top: 5px;
    }
  }

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
