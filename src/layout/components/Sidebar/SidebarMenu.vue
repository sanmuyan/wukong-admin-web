<template>
  <el-menu
    :default-active="activeMenu"
    :collapse="!$store.getters.sidebarOpened"
    :background-color="$store.getters.cssVar.menuBg"
    :text-color="$store.getters.cssVar.menuText"
    :active-text-color="$store.getters.cssVar.menuActiveText"
    :unique-opened="true"
    router
  >
    <sidebar-item
      v-for="item in routes"
      :key="item.path"
      :route="item"
    ></sidebar-item>
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { filterRouters, generateMenus } from '@/utils/route'
import SidebarItem from '@/layout/components/Sidebar/SidebarItem'

const router = useRouter()
const routes = computed(() => {
  const fRoutes = filterRouters(router.getRoutes())
  return generateMenus(fRoutes)
})
const route = useRoute()
const activeMenu = computed(() => {
  const { path } = route
  return path
})

</script>

<style lang="scss" scoped></style>
