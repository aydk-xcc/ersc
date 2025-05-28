import * as monaco from 'monaco-editor';

// 注册自定义悬浮提示提供者
export const registerCustomHoverProvider = (language: string) => {
    // 为JavaScript/TypeScript注册悬浮提示
    if (['javascript', 'typescript'].includes(language)) {
        monaco.languages.registerHoverProvider(language, {
            provideHover: function (model, position) {
                const word = model.getWordAtPosition(position);
                if (!word) return null;

                const lineContent = model.getLineContent(position.lineNumber);
                const wordText = word.word;

                // 自定义悬浮提示内容
                let hoverContent = getCustomHoverContent(wordText, lineContent, position);
                
                if (hoverContent) {
                    return {
                        range: new monaco.Range(
                            position.lineNumber,
                            word.startColumn,
                            position.lineNumber,
                            word.endColumn
                        ),
                        contents: hoverContent
                    };
                }
                return null;
            }
        });
    }

    // 为Markdown注册悬浮提示
    if (language === 'markdown') {
        monaco.languages.registerHoverProvider('markdown', {
            provideHover: function (model, position) {
                const lineContent = model.getLineContent(position.lineNumber);
                
                // 检测链接
                const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                let match;
                while ((match = linkRegex.exec(lineContent)) !== null) {
                    const start = match.index;
                    const end = start + match[0].length;
                    if (position.column >= start + 1 && position.column <= end + 1) {
                        return {
                            range: new monaco.Range(
                                position.lineNumber,
                                start + 1,
                                position.lineNumber,
                                end + 1
                            ),
                            contents: [
                                { value: `**链接**: ${match[1]}` },
                                { value: `**地址**: ${match[2]}` },
                                { value: '点击 Ctrl+Click 打开链接' }
                            ]
                        };
                    }
                }

                // 检测标题
                if (lineContent.startsWith('#')) {
                    const level = lineContent.match(/^#+/)?.[0].length || 0;
                    return {
                        range: new monaco.Range(
                            position.lineNumber,
                            1,
                            position.lineNumber,
                            lineContent.length + 1
                        ),
                        contents: [
                            { value: `**标题级别**: H${level}` },
                            { value: '这是一个Markdown标题' }
                        ]
                    };
                }

                return null;
            }
        });
    }
};

// 获取自定义悬浮内容
const getCustomHoverContent = (word: string, lineContent: string, position: monaco.Position) => {
    // 检测函数调用
    if (lineContent.includes(`${word}(`)) {
        const functionInfo = analyzeFunctionCall(word, lineContent);
        return [
            { value: `**🔧 函数**: \`${word}\`` },
            { value: functionInfo.description },
            { value: `**📍 位置**: 第${position.lineNumber}行，第${position.column}列` },
            { value: functionInfo.params ? `**📝 参数**: ${functionInfo.params}` : '' },
            { value: '💡 *提示: 双击选择整个函数调用*' }
        ].filter(item => item.value);
    }

    // 检测变量声明
    if (lineContent.includes(`const ${word}`) || lineContent.includes(`let ${word}`) || lineContent.includes(`var ${word}`)) {
        const varType = getVariableType(lineContent, word);
        return [
            { value: `**📦 变量**: \`${word}\`` },
            { value: `**🏷️ 类型**: ${varType}` },
            { value: '这是一个变量声明' },
            { value: `**📍 位置**: 第${position.lineNumber}行` },
            { value: '💡 *提示: 变量作用域从声明处开始*' }
        ];
    }

    // 检测import语句
    if (lineContent.includes('import') && lineContent.includes(word)) {
        const importInfo = analyzeImport(lineContent, word);
        return [
            { value: `**📥 导入**: \`${word}\`` },
            { value: `**📦 来源**: ${importInfo.source}` },
            { value: `**🔗 类型**: ${importInfo.type}` },
            { value: '可以通过 Ctrl+Click 跳转到定义' },
            { value: '💡 *提示: 检查是否正确导入*' }
        ];
    }

    // 检测React组件
    if (word.charAt(0) === word.charAt(0).toUpperCase() && lineContent.includes(`<${word}`)) {
        const componentInfo = analyzeReactComponent(word, lineContent);
        return [
            { value: `**⚛️ React组件**: \`${word}\`` },
            { value: '这是一个React组件' },
            { value: `**🎯 Props**: ${componentInfo.props || '无'}` },
            { value: '组件名称以大写字母开头' },
            { value: '💡 *提示: 检查组件是否正确导入*' }
        ];
    }

    // 检测CSS类名
    if (lineContent.includes('className') && lineContent.includes(word)) {
        return [
            { value: `**🎨 CSS类**: \`${word}\`` },
            { value: '这是一个CSS类名' },
            { value: '用于样式定义' },
            { value: '💡 *提示: 确保对应的CSS文件已导入*' }
        ];
    }

    // 检测Hook
    if (word.startsWith('use') && word.length > 3) {
        const hookInfo = analyzeHook(word, lineContent);
        return [
            { value: `**🪝 React Hook**: \`${word}\`` },
            { value: hookInfo.description },
            { value: hookInfo.rules },
            { value: '💡 *提示: Hook只能在组件顶层调用*' }
        ];
    }

    // 检测API调用
    if (lineContent.includes('fetch') || lineContent.includes('axios') || lineContent.includes('api')) {
        return [
            { value: `**🌐 API调用**: \`${word}\`` },
            { value: '这可能是一个API相关的调用' },
            { value: '💡 *提示: 记得处理错误和加载状态*' }
        ];
    }

    // 通用信息
    if (word.length > 2) {
        const wordInfo = analyzeWord(word, lineContent);
        return [
            { value: `**🔍 标识符**: \`${word}\`` },
            { value: `**📏 长度**: ${word.length} 字符` },
            { value: `**📍 位置**: 第${position.lineNumber}行，第${position.column}列` },
            { value: wordInfo.suggestion ? `💡 **建议**: ${wordInfo.suggestion}` : '' }
        ].filter(item => item.value);
    }

    return null;
};

// 分析函数调用
const analyzeFunctionCall = (funcName: string, lineContent: string) => {
    const commonFunctions: Record<string, any> = {
        'console.log': { description: '控制台输出函数', params: 'any' },
        'useState': { description: 'React状态Hook', params: 'initialState' },
        'useEffect': { description: 'React副作用Hook', params: 'effect, deps?' },
        'setTimeout': { description: '延时执行函数', params: 'callback, delay' },
        'setInterval': { description: '定时执行函数', params: 'callback, interval' },
        'map': { description: '数组映射方法', params: 'callback' },
        'filter': { description: '数组过滤方法', params: 'predicate' },
        'reduce': { description: '数组归约方法', params: 'reducer, initialValue?' }
    };

    return commonFunctions[funcName] || { 
        description: '自定义函数调用',
        params: null
    };
};

// 获取变量类型
const getVariableType = (lineContent: string, varName: string) => {
    if (lineContent.includes('useState')) return 'React State';
    if (lineContent.includes('useRef')) return 'React Ref';
    if (lineContent.includes('[]')) return 'Array';
    if (lineContent.includes('{}')) return 'Object';
    if (lineContent.includes('"') || lineContent.includes("'")) return 'String';
    if (lineContent.includes('true') || lineContent.includes('false')) return 'Boolean';
    if (/\d+/.test(lineContent)) return 'Number';
    return 'Unknown';
};

// 分析导入语句
const analyzeImport = (lineContent: string, word: string) => {
    const source = lineContent.match(/from\s+['"]([^'"]+)['"]/)?.[1] || 'unknown';
    let type = 'Named Import';
    
    if (lineContent.includes(`import ${word}`)) type = 'Default Import';
    if (lineContent.includes(`* as ${word}`)) type = 'Namespace Import';
    
    return { source, type };
};

// 分析React组件
const analyzeReactComponent = (componentName: string, lineContent: string) => {
    const propsMatch = lineContent.match(/<\w+\s+([^>]+)>/);
    const props = propsMatch ? propsMatch[1].split(/\s+/).length : 0;
    
    return {
        props: props > 0 ? `${props} 个属性` : '无属性'
    };
};

// 分析Hook
const analyzeHook = (hookName: string, lineContent: string) => {
    const hookInfo: Record<string, any> = {
        'useState': { 
            description: '管理组件状态的Hook',
            rules: '返回 [state, setState] 数组'
        },
        'useEffect': { 
            description: '处理副作用的Hook',
            rules: '用于数据获取、订阅、手动DOM操作'
        },
        'useContext': { 
            description: '消费Context的Hook',
            rules: '接收Context对象作为参数'
        },
        'useCallback': { 
            description: '缓存回调函数的Hook',
            rules: '返回记忆化的回调函数'
        },
        'useMemo': { 
            description: '缓存计算结果的Hook',
            rules: '返回记忆化的值'
        }
    };

    return hookInfo[hookName] || {
        description: '自定义Hook',
        rules: 'Hook名称必须以"use"开头'
    };
};

// 分析单词
const analyzeWord = (word: string, lineContent: string) => {
    let suggestion = '';
    
    // 检查命名规范
    if (word.includes('_') && !word.startsWith('_')) {
        suggestion = '建议使用驼峰命名法';
    } else if (word === word.toUpperCase() && word.length > 1) {
        suggestion = '这可能是一个常量';
    } else if (word.charAt(0) === word.charAt(0).toUpperCase()) {
        suggestion = '这可能是一个类名或组件名';
    }
    
    return { suggestion };
};