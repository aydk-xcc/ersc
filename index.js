let fs = require('fs');
const acorn = require('acorn');
let fileUtils = require('./utils/fileUtils');
const erscTree = {
    name: 'vuex',
    baseDir: './example/vuex/',
    entryFile: 'index.js',
    files: []
}

getFiles(erscTree.baseDir, '');
erscTree.files.forEach(file => getSingleFile(file));
saveJson();

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

    // let arr = str.split('\n');
    // arr.forEach(line => {
    //     if (line.trim().startsWith('function') || line.trim().startsWith('async function')) {
    //         file.funcs.push({
    //             name: /function ([^ (]*)/.exec(line)[1],
    //             type: 'fnuction'
    //         })
    //     } else if (line.trim().startsWith('export function') || line.trim().startsWith('export async function')) {
    //         file.exps.push({
    //             name: /function ([^ (]*)/.exec(line)[1],
    //             type: 'fnuction'
    //         })
    //     } else if (line.trim().startsWith('export class')) {
    //         file.exps.push({
    //             name: /class ([^ (]*)/.exec(line)[1],
    //             type: 'class'
    //         })
    //     }
    // });
}

function saveJson() {
    fileUtils.noExitAndCreate(`./output/${erscTree.name}`);
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
            file.exps.push({
                name: node.declaration.id.name,
                type: 'fnuction'
            });
            break;
    }
  }
}

console.log(functions);
