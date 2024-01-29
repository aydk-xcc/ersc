<script setup lang="ts">
  import { RouterView, useRoute } from 'vue-router';
  import { ref, watchEffect, onMounted } from 'vue';
  import {Loading} from '@element-plus/icons-vue';
  import { Picture, Document, ArrowRightBold, ArrowLeftBold } from '@element-plus/icons-vue';
  import Header from '@/components/header/Header.vue';

  const isCollapse = ref(false);
  const currentPath = ref('/graph');
  const currentProject = ref(null);
  const loading = ref(false);

  function handleCollapse() {
    isCollapse.value = !isCollapse.value;
  }
  const route = useRoute();

  function loadProject(e: Project.Project) {
    currentProject.value = e;
    loading.value = false;
  }

  onMounted(() => {
    loading.value = true;
  })

  watchEffect(() => {
    // 当路由变化时更新当前路径
    currentPath.value = route.path;
  });
</script>

<template>
  <el-container
    v-loading="loading"
    element-loading-text="Loading..."
    element-loading-background="rgba(255, 255, 255, 0.7)"
    direction="vertical"
  >
    <Header
      @currentProject="loadProject"
    />
    <el-container>
      <el-aside style="width:auto;">
        <el-menu
          :default-active="currentPath"
          :router="true"
          class="aside-menu"
          :collapse="isCollapse"
        >
          <el-menu-item index="/graph">
            <el-icon><Picture /></el-icon>
            <template #title>结构图</template>
          </el-menu-item>
          <el-menu-item index="/code">
            <el-icon><document /></el-icon>
            <template #title>代码</template>
          </el-menu-item>
        </el-menu>
        <div
          class="expand-icon"
          @click="handleCollapse"
        >
          <el-icon v-if="isCollapse"><ArrowRightBold /></el-icon>
          <el-icon v-else><ArrowLeftBold /></el-icon>
        </div>
      </el-aside>
      <el-main class="main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
  .aside-menu {
    height: 100%;
  }

  .el-menu--vertical {
    width: 200px;
  }

  .el-menu--collapse {
    width: 65px !important;
  }

  .expand-icon {
    position: absolute;
    border-right: solid 1px var(--el-menu-border-color);
    bottom: 0;
    width: 100%;
    display: flex;
    height: 40px;
    justify-content: center;
    align-items: center;
    border-top: 1px #f0f0f0 solid;
    background-color: #f9f9f9;
    cursor: pointer;
  }
  .header {
    display: flex;
    align-items: center;
    background-color: #1067EE;
    color: white;
  }
  .main {
    padding: 0px;
  }
</style>
