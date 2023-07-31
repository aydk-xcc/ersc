<script setup lang='ts'>
    import * as monaco from 'monaco-editor';
    import { onBeforeUnmount, onMounted, onUnmounted, ref, toRaw } from 'vue';
    import '../../worker';
    import {clearDefaultContextMenu, addActions} from './option.js';
    import {parseAst} from '../../utils/resolveAst';


    const editorRef = ref<HTMLElement | null>(null);
    let editor:monaco.editor.IStandaloneCodeEditor|null = null;
    onMounted(async () => {
	    if (editorRef.value && !editor) {
            // 清理默认右键菜单
            clearDefaultContextMenu();
            editor = monaco.editor.create(editorRef.value, {
                value: 'My to-do list:\n* buy milk\n* buy coffee\n* write awesome code',
                language: "javascript",
                fixedOverflowWidgets: true,
                fontFamily: "Arial",
                fontSize: 14,
                readOnly: true,
                tabSize: 4,
                insertSpaces: true,
                overviewRulerLanes: 0,
                wordWrap: 'on',
                wordWrapColumn: 120,
                hover: {
                    above: true,
                    enabled: true
                },
                minimap: {
                    // enabled: false
                    autohide: false,
                    size: 'fit',
                    scale: 1,
                    renderCharacters: false,
                },

                scrollbar: {
                    verticalScrollbarSize: 5,
                    verticalSliderSize: 6,
                    useShadows: false,
                    scrollByPage: false
                }
            });
            // 增加aciton
            addActions(editor);

            editor.onContextMenu((e: monaco.editor.IEditorMouseEvent) => {
                let mode = editor.getModel();
                console.log(mode?.getWordAtPosition(e.target.position));
                console.log(mode?.getLineContent(e.target.position.lineNumber));
                console.log(mode.getLineTokens)

            });

            monaco.editor.addCommand({
                id: 'test',
                run: () => {}
            })

            let p1 = new monaco.Position(1, 2);
            let p2 = new monaco.Position(0, 9);
            monaco.Position.compare(p1, p2);
            console.log(monaco.Position.compare(p1, p2))
            console.log()
        }
	});
    onUnmounted(() => toRaw(editor)?.dispose());

    function updateValue(content: string) {
        editor?.setValue(content);
        console.log(parseAst(content));
    }

    defineExpose({
        updateValue
    })

</script>
<template>
    <div class="editor" ref="editorRef" />
</template>
<style lang="less" scoped>
    .editor {
        width: 100%;
        height: 100%;
    }
</style>