<script setup lang="ts">
  import { onBeforeUnmount, onMounted, onUnmounted, reactive, ref, toRaw } from 'vue'
  import type { AxiosResponse } from 'axios';
  import {ArrowRightBold} from '@element-plus/icons-vue';
  import fileApi from '@/api/fileApi';
  import editor from '@/components/editor/Index.vue';
  import { MutationType } from 'pinia';
  import { useProjectStore } from '@/stores/project';

  interface File {
      label: string,
      children: Array<File>
      path: string,
      str?: string,
      isDir: boolean,
      fullPath: string
  }

  const defaultProps = {
    children: 'children',
    label: 'label',
  }
  const files: File[] = reactive([]);
  const editorViewRef = ref(editor);
  const projectStore = useProjectStore();
  projectStore.$subscribe((mutation, state) => {
    console.log(mutation, state);
    if (mutation.storeId === 'project') {
      // 修改的是project
      if (state.projectInfo.id) {
        getProjectInfo();
      }
    }
  })

  function getProjectInfo() {
    fileApi.getFiles(projectStore.projectInfo.base_dir).then((res: any) => {
      console.log(res);
      if (res.data) {
        files.push(...res.data);
      }
    })
  }


  onMounted(async () => {
    if (projectStore.projectInfo.id) {
      getProjectInfo();
    }
  });

  // onUnmounted(() => toRaw(editor)?.dispose());


  const handleNodeClick = (data: File) => {
    if (!data.isDir) {
      fileApi.getFile(data.label, data.path).then(res => {
        editorViewRef.value.updateValue(res.data);
      })
    }
  }
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="slider" width="200px">
        <el-tree
          :data="files"
          :icon="ArrowRightBold"
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span
                v-if="data.label === 'index.js'"
                class="index-file-icon" 
                type="primary"
              >入</span>
            </span>
          </template>
        </el-tree>
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
<style lang="scss" scoped>
  .index-file-icon {
    display: inline-block;
    background-color: green;
    color: white;
    font-size: 12px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    margin-left: 32px;
    border-radius: 4px;
  }
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
    height: 100%;
    .editor-view {
      display: flex;
      flex: 1 0 auto;
      overflow: hidden;
      height: 100%;
    }
    .right {
      width: 300px;
      border-left: 1px solid #f0f0f0;
    }
  }
</style>
./components/editor/Index.vue@/config/request