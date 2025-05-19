<script setup lang="ts">
  import { onMounted, onUpdated, reactive, ref } from 'vue'
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
  const defaultExpandKeys: Array<string> = reactive([]);
  const projectStore = useProjectStore();
  const currentFile = ref('');
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
    initDefaultExpand();
    fileApi.getFiles(projectStore.projectInfo.base_dir).then((res: any) => {
      files.splice(0, files.length);
      if (res.data) {
        files.push(...res.data);
        currentFile.value = projectStore.projectInfo.entry;
        fileApi.getFile(projectStore.projectInfo.base_dir + '/' + projectStore.projectInfo.entry).then(res => {
          editorViewRef.value.updateValue(res.data.str);
        })
      }
    })
  }

  function initDefaultExpand() {
    defaultExpandKeys.splice(0,defaultExpandKeys.length);
    let arr = projectStore.projectInfo.entry.split('/');
    if (arr.length) {
      arr.slice(0, arr.length - 1).forEach((item: string) => {
        if (defaultExpandKeys.length) {
          defaultExpandKeys.push(`${defaultExpandKeys[defaultExpandKeys.length - 1]}/${item}`);
        } else {
          defaultExpandKeys.push(`${projectStore.projectInfo.base_dir}/${item}`);
        }
      })
    }
  }

  onMounted(async () => {
    if (projectStore.projectInfo.id) {
      getProjectInfo();
    }
  });

  onUpdated(async () => {
    if (projectStore.projectInfo.id) {
      getProjectInfo();
    }
  });

  // onUnmounted(() => toRaw(editor)?.dispose());


  const handleNodeClick = (data: File) => {
    if (!data.isDir) {
      currentFile.value = data.fullPath.replace(projectStore.projectInfo?.base_dir + '/', '');
      fileApi.getFile(data.fullPath).then(res => {
        editorViewRef.value.updateValue(res.data.str);
      })
    }
  }
</script>

<template>
  <div class="common-layout">
    <el-container class="main-container">
      <el-aside class="slider" width="200px">
        <el-tree
          :data="files"
          :default-expanded-keys="defaultExpandKeys"
          :icon="ArrowRightBold"
          :current-node-key="projectStore.projectInfo.base_dir + '/' + projectStore.projectInfo.entry"
          node-key="fullPath"
          :highlight-current="true"
          :props="defaultProps"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span
                v-if="data.fullPath === projectStore.projectInfo.base_dir + '/' + projectStore.projectInfo.entry"
                class="index-file-icon" 
                type="primary"
              >入</span>
            </span>
          </template>
        </el-tree>
      </el-aside>
      <el-main class="editor-container">
        <el-breadcrumb class="breadcrumb" separator="/">
          <el-breadcrumb-item
            v-for="(item, index) in currentFile.split('/')"
          >{{ item }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="editor-container-view">
          <div class="editor-view">
            <editor ref="editorViewRef"></editor>
          </div>
          <div class="right">
              test

          </div>
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

  .main-container {
    height: 100%;
  }
  .editor-container {
    padding: 0px;
    display: flex;
    flex-direction: column;
    height: 100%;
    .breadcrumb {
      padding: 0px 0 10px 8px;
      border-bottom: 1px solid #f0f0f0;
    }

    .editor-container-view {
      padding: 0px;
      display: flex;
      flex-direction: row;
      height: calc(100% - 25px);
    }

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
  ::v-deep .el-tree {
    width: max-content;
    min-width: 200px;
    padding-right: 10px;
  }
</style>