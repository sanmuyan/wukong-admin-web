<template>
  <div class="">
    <div class="logo-container">
      <el-avatar
        :size='logoHeight'
        shape="square"
      >
        <svg-icon icon="logo"/>
      </el-avatar>
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
import { useStore } from 'vuex'
import { watch, reactive } from 'vue'

const logoHeight = 44
const store = useStore()

const css = reactive({
  justifyContent: 'center'
})

watch(() => store.getters.sidebarOpened, (currentValue, preValue) => {
  if (currentValue === true) {
    css.justifyContent = 'center'
  } else {
    css.justifyContent = 'flex-end'
  }
})

</script>

<style lang="scss" scoped>

.logo-container {
  height: v-bind(logoHeight) + 'px';
  padding: 10px 0 22px 0;
  display: flex;
  align-items: center;
  justify-content: v-bind('css.justifyContent');

  .svg-icon {
    width: 5em;
    height: 5em;
  }

  .logo-title {
    margin-left: 6px;
    color: #fff;
    font-weight: 600;
    line-height: 50px;
    font-size: 16px;
    white-space: nowrap;
  }
}
</style>
