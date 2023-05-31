<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { onBeforeUnmount, onMounted, onUnmounted, ref, toRaw } from 'vue'
import {BASE_HOST} from '../api/serviceConfig';
import request from '../api/request';
import '../worker';

const editorRef = ref<HTMLElement | null>(null);
let editor:monaco.editor.IStandaloneCodeEditor|null = null;
const files = ref({arr:[]});
onMounted(async () => {
	if (editorRef.value && !editor) {
    // monaco.editor.defineTheme("myTheme", {
    //   base: "vs",
    //   inherit: true,
    //   rules: [],
    //   colors: {
    //     "editor.foreground": "#000000",
    //     "editor.background": "#EDF9FA",
    //     "editorCursor.foreground": "#8B0000",
    //     "editor.lineHighlightBackground": "#0000FF20",
    //     "editorLineNumber.foreground": "#008800",
    //     "editor.selectionBackground": "#88000030",
    //     "editor.inactiveSelectionBackground": "#88000015",
    //   },
    // });
    // monaco.editor.setTheme("myTheme");
		editor = monaco.editor.create(editorRef.value, {
			value: 'My to-do list:\n* buy milk\n* buy coffee\n* write awesome code',
			language: "javascript",
	    fontFamily: "Arial",
	    fontSize: 16,
      readOnly: true,
      tabSize: 4,
      insertSpaces: true,
      wordWrap: 'on',
      wordWrapColumn: 120
		});

    let mode = editor.getModel();
    let select = editor.getSelection();
  
    editor.onDidChangeCursorSelection((e) => {
      let select = editor.getSelection();
      console.log(mode.getValueInRange(select));
    });

	}
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
    console.log(e);
    editor.setValue(e);
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
