<template>
  <!--  主体结构-->
  <div class="app-wrapper" :class="[$store.getters.sidebarOpened ? 'openSidebar' : 'hideSidebar']">
    <!--    左侧菜单-->
    <sidebar onselectstart="return false" class="sidebar-container" :style="{backgroundColor: $store.getters.cssVar.menuBg}"></sidebar>
    <!--    主菜菜单-->
    <div class="main-container">
      <!--        顶部导航条-->
      <div onselectstart="return false" class="fixed-header">
        <navbar></navbar>
        <!--        标签页-->
        <tags-view></tags-view>
      </div>
      <!--      内容区-->
      <app-main></app-main>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/layout/components/Navbar'
import Sidebar from '@/layout/components/Sidebar'
import AppMain from '@/layout/components/AppMain'
import TagsView from '@/components/TagsView'</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.module.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width #{$sideBarDuration};
}

.hideSidebar .fixed-header {
  width: calc(100% - #{$hideSideBarWidth});
}

</style>
