<script setup lang='ts'>
    import * as monaco from 'monaco-editor';
    import { onBeforeUnmount, onMounted, onUnmounted, ref, toRaw } from 'vue';
    import './worker';
    import {clearDefaultContextMenu, addActions} from './option.js';
    import {parseAst} from '@/utils/resolveAst';
    import { constrainedEditor } from "constrained-editor-plugin";


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
                readOnly: false,
                tabSize: 8,
                insertSpaces: true,
                overviewRulerLanes: 0,
                wordWrap: 'on',
                wordWrapColumn: 120,
                hover: {
                    above: true,
                    enabled: true
                },
                minimap: {
                    enabled: false,
                    autohide: false,
                    size: 'fit',
                    scale: 1,
                    renderCharacters: false,
                },

                // scrollbar: {
                //     verticalScrollbarSize: 5,
                //     verticalSliderSize: 6,
                //     useShadows: false,
                //     scrollByPage: false
                // }
            });
            const model = editor.getModel();
            // 增加aciton
            addActions(editor);

            // - Configuration for the Constrained Editor : Starts Here
            const constrainedInstance = constrainedEditor(monaco);
            constrainedInstance.initializeIn(editor);
            constrainedInstance.addRestrictionsTo(model, [{
                range: [1, 1, 3, 5], // Range of Function definition
                allowMultiline: false,
                label: 'funcDefinition'
            }]);

            editor.onContextMenu((e: monaco.editor.IEditorMouseEvent) => {
                console.log(model?.getWordAtPosition(e.target.position));
                console.log(model?.getLineContent(e.target.position.lineNumber));
                console.log(model.getLineTokens)

            });

            // for (let i = 0;i<10;i++) {
            //     ssfa
            // }

            editor.onDidChangeCursorPosition((e: monaco.editor.IEditorPositionChangeEvent) => {
                console.log(model?.getOptions());
                console.log(model?.getLineContent(e.position.lineNumber));
                console.log(model?.getWordUntilPosition(e.position));
                let lineContent = model?.getLineContent(e.position.lineNumber);
                let firstNonWhitespaceIndex = model?.getLineFirstNonWhitespaceColumn(e.position.lineNumber);
                let firstChart = lineContent[firstNonWhitespaceIndex];
                console.log(monaco.editor.tokenize(lineContent, model.getLanguageId()));
                let word = model?.getWordAtPosition(e.position);
                let language = monaco.languages.getLanguages().find(item => item.id === model.getLanguageId());
                if (['*', '/'].includes(firstChart)) {
                    console.log('comment');
                }
            });

            editor.onDidChangeCursorSelection((e: monaco.editor.IEditorSelectionChangeEvent) => {
                console.log('onDidChangeCursorSelection', e.position);
            });

            editor.onDidChangeModel((e: monaco.editor.IModelChangedEvent) => {
                console.log('Editor model changed:', e.newModelUrl);
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

    // function getDocumentTokenize() {
    //     if (editor) {
    //         const tokens = monaco.editor.tokenize(text, languageId);
    //     }
    // }

    function updateValue(content: string) {
        editor?.setValue(content);
        console.log(monaco.editor.tokenize(content, 'javascript'));
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
</style>../../../worker../../../utils/resolveAst