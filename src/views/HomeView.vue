<script setup lang="ts">
import * as monaco from'monaco-editor';
import { onBeforeUnmount, onMounted, onUnmounted, ref, toRaw } from 'vue'
import {BASE_HOST} from '../api/serviceConfig.js';

const editorRef = ref<HTMLElement | null>(null);
const editorInstance = ref<monaco.editor.IStandaloneCodeEditor | null>(null);
const tempList = ref([]);
onMounted(async () => {
	if (editorRef.value && !editorInstance.value) {
		editorInstance.value = monaco.editor.create(editorRef.value, {
			value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
			language: 'javascript',
      theme: 'vs', //官方自带三种主题vs, hc-black, or vs-dark
      selectOnLineNumbers: true,//显示行号
      roundedSelection: false,
      readOnly: false, // 只读
      cursorStyle: 'line', //光标样式
      automaticLayout: true, //自动布局
      glyphMargin: true, //字形边缘
      useTabStops: false,
      fontSize: 15, //字体大小
      autoIndent: true, //自动布局
      quickSuggestionsDelay: 100, //代码提示延时
		});
	}
  fetch(BASE_HOST + '/files').then(async res => {
    tempList.value  = await res.json();
  })
});
onUnmounted(() => toRaw(editorInstance.value)?.dispose());

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="slider" width="200px">
        <div v-for="(item, index) in tempList" :key="index" class="file">
          {{ item }}
        </div>
      </el-aside>
      <el-main class="main">
        <div class="editor" ref="editorRef" />
      </el-main>
    </el-container>
  </div>
</template>
<style>
  .editor {
    width: 100vw;
    height: 100vh;
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
  }
</style>
