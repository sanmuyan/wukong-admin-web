<template>
  <div class="">
    <div class="logo-container">
      <el-icon
        :size='28'
        color="#fff"
      >
        <svg-icon style="width: 100%; height: 100%; margin-right: 0" icon="logo"/>
      </el-icon>
      <h1 class="logo-title" v-if="$store.getters.sidebarOpened">
        {{$t('msg.navBar.logoTitle')}}
      </h1>
    </div>
    <el-scrollbar>
      <sidebar-menu></sidebar-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import SidebarMenu from './SidebarMenu'

</script>

<style lang="scss" scoped>

.logo-container {
  background: #233545;
  height: 40px;
  padding: 10px 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .logo-title {
    margin-left: 5px;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 16px;
    white-space: nowrap;
  }
}
</style>
