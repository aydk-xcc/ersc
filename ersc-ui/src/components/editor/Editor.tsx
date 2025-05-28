import * as monaco from 'monaco-editor';
import './worker.js';
import './editor.scss';
import {clearDefaultContextMenu, addActions} from './option.js';
import {parseAst} from '@/utils/resolveAst';
import { useRef, useEffect } from 'react';
import { registerCustomHoverProvider } from './customHoverProvide';

export default function Editor({codeInfo, filePath}: {codeInfo: string, filePath?: string}) {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    
    // 根据文件路径或内容检测语言
    const detectLanguage = (content: string, path?: string): string => {
        if (path) {
            const ext = path.split('.').pop()?.toLowerCase();
            switch (ext) {
                case 'md':
                case 'markdown':
                    return 'markdown';
                case 'js':
                    return 'javascript';
                case 'ts':
                    return 'typescript';
                case 'tsx':
                    return 'typescript';
                case 'jsx':
                    return 'javascript';
                case 'json':
                    return 'json';
                case 'css':
                    return 'css';
                case 'scss':
                    return 'scss';
                case 'html':
                    return 'html';
                case 'py':
                    return 'python';
                case 'java':
                    return 'java';
                case 'go':
                    return 'go';
                case 'rs':
                    return 'rust';
                case 'vue':
                    return 'html'; // Vue文件可以用html模式
                default:
                    return 'plaintext';
            }
        }
        
        // 如果没有路径，根据内容判断
        if (content.startsWith('#') || content.includes('##') || content.includes('```')) {
            return 'markdown';
        }
        
        return 'javascript'; // 默认
    };

    useEffect(() => {
        if (codeInfo && editor.current) {
            const language = detectLanguage(codeInfo, filePath);
            console.log('Setting editor language to:', language);
            console.log('Content:', codeInfo.substring(0, 100) + '...');
            updateValue(codeInfo, language);
        }
    }, [codeInfo, filePath]);

    useEffect(() => {
        if (editorRef.current && !editor.current) {
            // 清理默认右键菜单
            clearDefaultContextMenu();
            const language = detectLanguage(codeInfo || '', filePath);
            editor.current = monaco.editor.create(editorRef.current, {
                value: codeInfo || '',
                language: language,
                fixedOverflowWidgets: true,
                fontFamily: "Menlo",
                fontSize: 14,
                readOnly: true,
                tabSize: 4,
                insertSpaces: true,
                overviewRulerLanes: 0,
                wordWrap: 'on',
                automaticLayout: true,
                glyphMargin: true,
                scrollBeyondLastColumn: 0,
                scrollBeyondLastLine: false,
                renderWhitespace: 'all',
                hover: {
                    above: true,
                    enabled: true,
                    delay: 300, // 悬浮延迟时间
                    sticky: true // 悬浮框是否可以被鼠标悬浮
                },
                minimap: {
                    enabled: false,
                    autohide: false,
                    size: 'fit',
                    scale: 1,
                    renderCharacters: false,
                },
                scrollbar: {
                    verticalScrollbarSize: 2,
                    verticalSliderSize: 2,
                    useShadows: false,
                    scrollByPage: false
                }
            });
            const model = editor.current.getModel();
            
            // 注册自定义悬浮提示提供者
            registerCustomHoverProvider(language);
            
            // 增加aciton
            addActions(editor.current);

            // - Configuration for the Constrained Editor : Starts Here
            // const constrainedInstance = constrainedEditor(monaco);
            // constrainedInstance.initializeIn(editor);
            var decorations = editor.current.createDecorationsCollection([
                {
                    range: new monaco.Range(3, 1, 3, 1),
                    options: {
                        isWholeLine: true,
                        className: "myContentClass",
                        glyphMarginClassName: "line-operate",
                    },
                },
            ]);
            console.log(decorations);
            // constrainedInstance.addRestrictionsTo(model, [{
            //     range: [1, 1, 3, 5], // Range of Function definition
            //     allowMultiline: false,
            //     label: 'funcDefinition'
            // }]);

            // editor.onContextMenu((e: monaco.editor.IEditorMouseEvent) => {
            //     console.log(model?.getWordAtPosition(e.target.position));
            //     console.log(model?.getLineContent(e.target.position.lineNumber));
            //     console.log(model.getLineTokens)

            // });

            // editor.onDidChangeCursorPosition((e: monaco.editor.IEditorPositionChangeEvent) => {
            //     console.log(model?.getOptions());
            //     console.log(model?.getLineContent(e.position.lineNumber));
            //     console.log(model?.getWordUntilPosition(e.position));
            //     let lineContent = model?.getLineContent(e.position.lineNumber);
            //     let firstNonWhitespaceIndex = model?.getLineFirstNonWhitespaceColumn(e.position.lineNumber);
            //     let firstChart = lineContent[firstNonWhitespaceIndex];
            //     console.log(monaco.editor.tokenize(lineContent, model.getLanguageId()));
            //     let word = model?.getWordAtPosition(e.position);
            //     let language = monaco.languages.getLanguages().find(item => item.id === model.getLanguageId());
            //     if (['*', '/'].includes(firstChart)) {
            //         console.log('comment');
            //     }
            // });

            // editor.onDidChangeCursorSelection((e: monaco.editor.IEditorSelectionChangeEvent) => {
            //     console.log('onDidChangeCursorSelection', e);
            // });

            // editor.onDidChangeModel((e: monaco.editor.IModelChangedEvent) => {
            //     console.log('Editor model changed:', e.newModelUrl);
            // });

            // monaco.editor.addCommand({
            //     id: 'test',
            //     run: () => {}
            // })


            // let p1 = new monaco.Position(1, 2);
            // let p2 = new monaco.Position(0, 9);
            // monaco.Position.compare(p1, p2);
            // console.log(monaco.Position.compare(p1, p2))
            // console.log()
            console.log(editor.current);
        }
    }, []);
    function updateValue(content: string, language?: string) {
        console.log('updateValue called with:', { content: content.substring(0, 50) + '...', language });
        if (editor.current) {
            editor.current.setValue(content);
            
            // 设置语言模式
            if (language) {
                const model = editor.current.getModel();
                if (model) {
                    monaco.editor.setModelLanguage(model, language);
                }
            }
        }
        // console.log(monaco.editor.tokenize(content, 'javascript'));
        // console.log(parseAst(content));
        // monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
        // const model2 = monaco.editor.createModel(content, 'javascript');
        // const languageService = monaco.languages.typescript.getJavaScriptWorker().then(worker => {
            // worker(model2.uri).then(client => {
                // console.log(client, model2.uri.toString(), model2.getLineCount());
                // client.getScriptText(model2.uri.toString()).then(res => {
                //     console.log('getScriptText', res);
                // })
                // const decorations: any = [];
                // client.getNavigationTree(model2.uri.toString()).then(res => {
                //     console.log('getNavigationTree', res);
                //     // res.childItems.forEach(node => {
                    //     if (['class', 'function'].includes(node.kind)) {
                    //         let spans = node.spans[0];
                    //         // console.log('开始', model2.getPositionAt(spans.start));
                    //         let start = model2.getPositionAt(spans.start);
                    //         let end = model2.getPositionAt(spans.start + spans.length);
                    //         // console.log('结束', model2.getPositionAt(spans.start + spans.length));
                    //         decorations.push({
                    //             range: {
                    //                 startLineNumber: start.lineNumber, // 函数所在的行号
                    //                 startColumn: start.column,
                    //                 endLineNumber: end.lineNumber,
                    //                 endColumn: end.column
                    //             },
                    //             options: {
                    //                 isWholeLine: true,
                    //                 className: 'functionMarker', // 自定义类名
                    //                 glyphMarginClassName: 'functionGlyph' // 自定义标志的类名
                    //             }
                    //         })
                    //     }
                    // });
            //         var decorations = editor?.createDecorationsCollection([
            //             {
            //                 range: new monaco.Range(3, 1, 3, 2),
            //                 options: {
            //                     isWholeLine: true,
            //                     className: "myContentClass",
            //                     glyphMargin: {
            //                         position: 1,
            //                     },
            //                     shouldFillLineOnLineBreak: false,
            //                     glyphMarginClassName: "line-operate-un_read",
            //                     glyphMarginHoverMessage: {
            //                         value: '未读'
            //                     }
            //                 },
            //             },
            //             {
            //                 range: new monaco.Range(7, 3, 7, model2.getLineMaxColumn(7)),
            //                 options: {
                            
            //                     afterContentClassName: 'ine-operate-read',
            //                     isWholeLine: true,
            //                     className: "myContentClass",
            //                     glyphMarginClassName: "line-operate-read",
            //                 },
            //             },
            //             {
            //                 range: new monaco.Range(9, 1, 11, 1),
            //                 options: {
            //                     isWholeLine: true,
            //                     className: "myContentClass",
            //                     glyphMarginClassName: "line-operate-reading",
            //                 },
            //             },
            //         ]);
            //         console.log(decorations);
            //     })
            //     client.getSemanticDiagnostics(model2.uri.toString()).then(res => {
            //         console.log('getSemanticDiagnostics', res);
            //     });
            //     client.getSuggestionDiagnostics(model2.uri.toString()).then(res => {
            //         console.log('getSuggestionDiagnostics', res);
            //     });

            //     client.getSyntacticDiagnostics(model2.uri.toString()).then(res => {
            //         console.log('getSyntacticDiagnostics', res);
            //     });
            // });
        // });
        // let arr = editor.createDecorationsCollection([
        //         {
        //             options: {
        //                 isWholeLine: true,
        //                 after: {
        //                     content: '🚀' // 在右侧显示的内容，可以是HTML字符串
        //                 }
        //             },
        //             range: {
        //                 startColumn: 0,
        //                 startLineNumber: 3,
        //                 endLineNumber: 5,
        //                 endColumn: 10
        //             }
        //         }
        //     ]);
        //     editor?.deltaDecorations([], arr);
    }

    return (
        <div className="editor" ref={editorRef} />
    )
};