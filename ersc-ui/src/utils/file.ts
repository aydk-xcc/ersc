export function getFileExt(fileName: string) {
    return fileName.split('.').pop() || '';
}

export function isDir(filePath: string) {
    return filePath.endsWith('/');
}

export function getFileIcon(fileName: string) {
    let ext = getFileExt(fileName).toLowerCase();
    switch (ext) {
        case 'js':
            return 'vs-js';
        case 'npm':
            return 'vs-npm';
        case 'esm':
        case 'mjs':
        case 'cjs':
            return 'vs-cjs';
        case 'vue':
            return 'vs-vue';
        case 'tpl':
            return 'vs-tpl';
        case 'wxml':
        case 'xml':
            return 'vs-xml';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'webp':
            return 'vs-image';
        case 'svg':
            return 'vs-svg';
        case 'c':
        case 'cpp':
        case 'h':
        case 'hpp':
        case 'hxx':
        case 'h++':
        case 'h#':
        case 'h#':
            return 'vs-c';
        case 'c++':
            return 'vs-c2';
        case 'c#':
            return 'vs-c3';
        case 'react':
            return 'vs-react';
        case 'license':
            return 'vs-license';
        case 'setting':
            return 'vs-setting';
        case 'log':
            return 'vs-log';
        case 'java':
            return 'vs-java';
        case 'py':
            return 'vs-python';
        case 'git':
            return 'vs-git';
        case 'less':
            return 'vs-less';
        case 'scss':
            return 'vs-scss';
        case 'css':
            return 'vs-css';
        case 'html':
            return 'vs-html';
        case 'md':
            return 'vs-md';
        case 'ts':
            return 'vs-ts';
        case 'tsx':
            return 'vs-react';
        case 'tsconfig':
            return 'vs-tsconfig';
        case 'json':
            return 'vs-json';
        case 'go':
            return 'vs-go';
        case 'yaml':
            return 'vs-yaml';
        case 'readme':
            return 'vs-readme';
        default:
            return 'vs-default';
    }
}