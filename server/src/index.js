let fs = require('fs');
const acorn = require('acorn');
let fileUtils = require('../utils/fileUtils');
const erscTree = {
    name: 'vuex',
    baseDir: './example/vuex/',
    entryFile: 'index.js',
    files: []
}

/**
 * 
 * @param {*} baseDir 根目录
 * @param {*} childDir 子目录
 */
function getFiles(baseDir, childDir) {
    fs.readdirSync(baseDir + childDir).forEach(item => {
        // console.log(baseDir + childDir + item);
        if (fs.statSync(baseDir + childDir + item).isDirectory()) {
            getFiles(baseDir, item + '/');
        } else {
            erscTree.files.push({
                name: item,
                childDir: childDir,
                funcs: [],
                relys: [],
                exps: []
            })
        }
    });
}

function getSingleFile(file) {
    let str = fs.readFileSync(erscTree.baseDir + file.childDir + file.name, 'utf-8');
    let code = acorn.parse(str, {
        ecmaVersion: 2020,
        sourceType: 'module',
        locations: true,
        ranges: true,
        onInsertedSemicolon: (char) => console.log(`Inserted semicolon at ${char}`),
        onTrailingComma: (node) => console.log(`Trailing comma at ${node.end}`),
        allowReserved: true,
        allowReturnOutsideFunction: true,
        allowImportExportEverywhere: true
    });
    fs.writeFileSync(`./output/${erscTree.name}/${file.name}.json`, JSON.stringify(code));
    console.log(file);
    traverse(code, file);
}

function saveJson() {
    fileUtils.noExitAndCreate(`./output/${erscTree.name}`);
    fs.writeFileSync(`./output/${erscTree.name}/erscTree.json`, JSON.stringify(erscTree));
    // fs.writeFileSync(`./output/${erscTree.name}/fileOverView.json`, JSON.stringify(erscTree));
}

// let str = fs.readFileSync(erscTree.baseDir + 'util.js', 'utf-8');
// let code = acorn.parse(str, {
//     ecmaVersion: 2020,
//     sourceType: 'module',
//     locations: true,
//     ranges: true,
//     onInsertedSemicolon: (char) => console.log(`Inserted semicolon at ${char}`),
//     onTrailingComma: (node) => console.log(`Trailing comma at ${node.end}`),
//     allowReserved: true,
//     allowReturnOutsideFunction: true,
//     allowImportExportEverywhere: true
// });

// console.log(JSON.stringify(code));
// fs.writeFileSync(`./output/${erscTree.name}/fileOverView2.json`, JSON.stringify(code));


function traverse(node, file) {
  if (node.body && ['Program'].includes(node.type)) {
    node.body.forEach(item => traverse(item, file));
  } else {
    console.log(node.type);
    switch(node.type) {
        case 'ExportNamedDeclaration':
            console.log(file);
            dealExportNamedDeclaration(node, file.exps);
            break;
        case 'ExportDefaultDeclaration':
            // 默认导出
            dealExportDefaultDeclaration(node, file.exps);
            break;
        case 'ImportDeclaration':
            // 默认导出
            dealImportDeclaration(node, file.relys);
            break;
        case 'FunctionDeclaration':
            // 默认导出
            dealFunctionDeclaration(node, file.funcs);
            break;
    }
  }
}

function dealExportNamedDeclaration(node, arr) {
    if (node.declaration) {
        switch(node.declaration.type) {
            case 'VariableDeclaration': // 变量声明语句 ，要往下找
                // 因为是导出，所以不考虑多个的情况
                let obj = {
                    nodeType: node.declaration.type,
                    name: node.declaration.declarations[0].id.name,
                    type: node.declaration.declarations[0].init.type
                };
                if (node.declaration.declarations[0].init.type === 'CallExpression') {
                    obj['callee'] = {
                        type: node.declaration.declarations[0].init.callee.type,
                        name: node.declaration.declarations[0].init.callee.name
                    };
                }
                arr.push(obj);
                break;
            case 'FunctionDeclaration':
                let FunctionDeclaration = {
                    nodeType: node.declaration.type,
                    name: node.declaration.id.name,
                    type: node.declaration.id.type
                };
                arr.push(FunctionDeclaration);
                break;
            case 'ClassDeclaration':
                let ClassDeclaration = {
                    nodeType: node.declaration.type,
                    name: node.declaration.id.name,
                    type: node.declaration.id.type
                };
                arr.push(ClassDeclaration);
                break;

        }
    } else if (node.specifiers) {
        node.specifiers.forEach(specifier => {
            arr.push({
                type: specifier.type,
                key: specifier.local.name,
                value: specifier.exported.name
            });
        });
    }
}

function dealExportDefaultDeclaration(node, arr) {
    switch(node.declaration.type) {
        case "ObjectExpression":
            node.declaration.properties.forEach(item => {
                arr.push({
                    nodeType: node.declaration.type,
                    type: item.value.type,
                    key: item.key.name,
                    value: item.value.value || item.value.name
                })
            });
            console.log(node, arr);
            break;
        case 'ClassDeclaration':
            arr.push({
                nodeType: node.declaration.type,
                name: node.declaration.id.name,
                type: node.declaration.id.type
            });
            break;
    }
}

function dealImportDeclaration(node, arr) {
    if (node.specifiers) {
        node.specifiers.forEach(specifier => {
            arr.push({
                nodeType: 'ImportDeclaration',
                type: specifier.type,
                local: specifier.local.name,
                imported: specifier.imported ? specifier.imported.name : '',
                source: node.source.value
            });
        });
    }
}

function dealFunctionDeclaration(node, arr) {
    arr.push({
        nodeType: 'FunctionDeclaration',
        type: node.type,
        name: node.id.name,
    });
}
