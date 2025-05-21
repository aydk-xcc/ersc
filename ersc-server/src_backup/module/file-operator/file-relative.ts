const fs = require('fs');
const path = require('path');
const parse = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const fileUtils = require('../../utils/fileUtils');
const {BASE_DIR, FILE_EXTNAME} = require('../../const/const');

let baseSecDir = '';

exports.getFileRelative = (pro_dir: string, entry: string) => {
    const arr: Array<Relative.RelativeUnit> = [];
    const recordArr: Array<string> = [];
    baseSecDir = fileUtils.getSrcDir(entry);
    dealFileDataRelative(pro_dir, entry, arr, recordArr);
    return arr;
}



function dealFileDataRelative(pro_dir: string, filePath: string, arr: Array<Relative.RelativeUnit>, recordArr: Array<string>) {
    if (arr.find(item => item.path === filePath)) {
        return;
    }
    const entryPath = path.join(BASE_DIR, pro_dir, filePath);
    console.log(entryPath);
    const file = fs.readFileSync(entryPath, 'utf-8');
    try {
        // let acTree = acorn.parse(file, acornConfig);
        let babelTree = parse.parse(file, {
            sourceType: "module",
            plugins: [
                // enable jsx and flow syntax
                "typescript",
            ],
        });
        let obj: Relative.RelativeUnit = {
            name: path.basename(filePath),
            path: filePath,
            imports: [],
            exports: []
        };
        traverse(babelTree, {
            ImportDeclaration(p: any) {
                let node = p.node;
                let currentPath = path.dirname(filePath);
                path.isAbsolute(currentPath) ? '' : (currentPath = '/' + currentPath);
                let importFilePath = node.source.value;
                if (!(node.source.value.startsWith('./' || node.source.value.startsWith('../') || node.source.value.startsWith('@')))) {
                    importFilePath = path.join(baseSecDir, importFilePath);
                } else {
                    importFilePath = path.resolve(currentPath, importFilePath);
                }
                if (fs.existsSync(path.join(BASE_DIR, pro_dir, importFilePath)) && fs.statSync(path.join(BASE_DIR, pro_dir, importFilePath)).isDirectory()) {
                    importFilePath +=  '/index';
                }
                if (!path.extname(importFilePath)) {
                    for(let i = 0; i < FILE_EXTNAME.length; i++) {
                        if (fs.existsSync(path.join(BASE_DIR, pro_dir, importFilePath + FILE_EXTNAME[i]))) {
                            importFilePath += FILE_EXTNAME[i];
                            break;
                        }
                    }
                }
                if (!fileUtils.isOutDepence(path.join(BASE_DIR, pro_dir, importFilePath))) {
                    obj.imports.push({
                        name: path.basename(importFilePath),
                        fromFile: node.source.value.includes('/') ? importFilePath: path.basename(importFilePath),
                        is_out: false,
                        specifiers: node.specifiers.map((item: any) => item.imported?.name)
                    });
                    if (!recordArr.includes(importFilePath)) {
                        recordArr.push(importFilePath);
                        dealFileDataRelative(pro_dir, importFilePath, arr, recordArr);
                    }
                } else {
                    obj.imports.push({
                        name: node.source.value,
                        fromFile: node.source.value,
                        is_out: true,
                        specifiers: node.specifiers.map((item: any) => item.imported?.name)
                    });
                }
            },
            ExportNamedDeclaration(node: any) {
                obj.exports.push(node.node);
            },
            ExportDefaultDeclaration(node: any) {
                obj.exports.push(node.node);
            },
        });
        arr.push(obj);
    } catch (e) {
        console.log(e);   
    }
}