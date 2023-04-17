<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <el-container>
    <el-header class="header">
      测试编辑器
    </el-header>
    <el-main><RouterView /></el-main>
  </el-container>
</template>

<style scoped>
  .header {
    display: flex;
    align-items: center;
    background-color: #1067EE;
    color: white;
  }
</style>
