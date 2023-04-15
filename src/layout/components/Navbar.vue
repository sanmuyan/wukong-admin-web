<template>
  <div class="navbar">
    <!--    汉堡按钮-->
    <hamburger class="hamburger-container"/>
    <!--    面包屑-->
    <breadcrumb></breadcrumb>
    <!--    顶部右侧按钮-->
    <div class="right-menu">
      <!--    全屏按钮-->
      <screen-full class="right-menu-item hover-effect"/>
      <!--      语言按钮-->
      <lang-select class="right-menu-item hover-effect"/>
      <!--      头像-->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar shape="square" :size="40">
            <svg-icon class="svg-avatar" icon="avatar"/>
          </el-avatar>
          <el-icon><arrow-down-bold /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu class="user-dropdown">
            <router-link to="/">
              <el-dropdown-item>{{ $t('msg.navBar.home') }}</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click="logout">{{ $t('msg.navBar.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import Hamburger from '@//components/Hamburger'
import Breadcrumb from '@//components/Breadcrumb'
import LangSelect from '@/components/LangSelect'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import ScreenFull from '@/components/ScreenFull'
import { ArrowDownBold } from '@element-plus/icons-vue'
import { restFull } from '@/api'

const i18n = useI18n()

const store = useStore()
const logout = async () => {
  await restFull('logout', 'POST')
  await store.dispatch('user/logout')
  ElMessage.success(i18n.t('msg.navBar.logout'))
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.hamburger-container {
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.5s;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
}

.right-menu {
  display: flex;
  align-items: center;
  float: right;
  padding-right: 16px;

  :deep .right-menu-item {
    display: inline-block;
    padding: 0 18px 0 0;
    font-size: 24px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  :deep .avatar-container {
    cursor: pointer;

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .el-avatar {
        margin-right: 12px;

        .svg-avatar {
          width: 3em;
          height: 3em;
        }
      }
    }
  }
}
</style>
