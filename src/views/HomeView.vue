<script setup lang="ts">
import * as monaco from'monaco-editor';
import { onBeforeUnmount, onMounted, onUnmounted, ref, toRaw } from 'vue'

const editorRef = ref<HTMLElement | null>(null);
const editorInstance = ref<monaco.editor.IStandaloneCodeEditor | null>(null);
onMounted(() => {
	if (editorRef.value && !editorInstance.value) {
		editorInstance.value = monaco.editor.create(editorRef.value, {
			value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
			language: 'typescript',
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
});
onUnmounted(() => toRaw(editorInstance.value)?.dispose());
</script>

<template>
  <div class="editor" ref="editorRef" />
</template>
<style>
  #codeEditBox {
    width:100%;
    height:200px;
  }
</style>
