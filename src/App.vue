<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>Header</el-header>
      <el-main><RouterView /></el-main>
    </el-container>
  </div>
</template>

<style scoped>
</style>
