<script setup lang="ts">
  import { onBeforeUnmount, onMounted, onUnmounted, ref, toRaw } from 'vue'
  import {BASE_HOST} from '../api/serviceConfig';
  import request from '../api/request';
  import editor from './editor/Index.vue';

  const files = ref({arr:[]});
  const editorViewRef = ref(editor);
  onMounted(async () => {
    fetch(BASE_HOST + '/files').then(async res => {
      files.value  = await res.json();
      console.log(files.value);
    })
  });
  onUnmounted(() => toRaw(editor)?.dispose());


  function clickFile(name: string) {
    request.get(BASE_HOST + '/singlefile', {
      params: {
        name: name
      }
    }).then(e => {
      editorViewRef.value.updateValue(e);
    })
  }
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="slider" width="200px">
        <div
          v-for="(item, index) in files.arr"
          :key="index"
          class="file"
          @click="clickFile(item.name)"
        >
          {{ item.name }}
        </div>
      </el-aside>
      <el-main class="main">
        <div class="editor-view">
          <editor ref="editorViewRef"></editor>
        </div>
        <div class="right">
            test

        </div>
      </el-main>
    </el-container>
  </div>
</template>
<style lang="less" scoped>
 .common-layout, .el-container {
  height: 100%;
 }
  .slider {
    background-color: white;
    border-right: 1px #f0f0f0 solid;
  }

  .file {
    color: black;
    background-color: white;
    padding: 5px 10px;
  }

  .file:hover {
    background-color: #ecf5ff;
  }

  .main {
    padding: 0px;
    display: flex;
    flex-direction: row;
    height: calc(100% - 50px);
    .editor-view {
      display: flex;
      flex: 1 0 auto;
      overflow: hidden;
      height: 100%;
    }
    .right {
      width: 300px;
      background-color: #00bbfa;
    }
  }
</style>
