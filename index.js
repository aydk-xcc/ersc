let fs = require('fs');
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
    let arr = str.split('\n');
    arr.forEach(line => {
        if (line.trim().startsWith('function') || line.trim().startsWith('async function')) {
            file.funcs.push({
                name: /function ([^ (]*)/.exec(line)[1],
                type: 'fnuction'
            })
        }
    });
}

function saveJson() {
    fileUtils.noExitAndCreate(`./output/${erscTree.name}`);
    fs.writeFileSync(`./output/${erscTree.name}/fileOverView.json`, JSON.stringify(erscTree));
}

// console.log(srscTree);
