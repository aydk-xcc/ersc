<script setup lang="ts">
import * as monaco from'monaco-editor';
import { onMounted, ref, toRaw } from 'vue'

const editor = ref(null)
const initEditor = () => {
  // 初始化编辑器，确保dom已经渲染
  editor.value = monaco.editor.create(document.getElementById('codeEditBox'), {
    value: '123', //编辑器初始显示文字
    language: 'javascript', //此处使用的python，其他语言支持自行查阅demo
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
  // 监听值的变化
  editor.value.onDidChangeModelContent((val) => {
    console.log(val.changes[0].text)
  })
}
onMounted(() => {
  initEditor();
});
</script>

<template>
  <div id="codeEditBox"></div>
</template>
<style>
  #codeEditBox {
    width:100%;
    height:200px;
  }
</style>
