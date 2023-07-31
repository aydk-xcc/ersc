const fs = require('fs');
const path = require('path')
const baseDir = 'example/vuex/'
const acorn = require('acorn');

exports.getModuleRealtive = () => {

}

exports.getFiles = () => {
    let arr = [];
    fn(baseDir, arr);
    return {
        basedir: baseDir,
        entry: 'index.js',
        arr
    };
}

exports.getFilesData = () => {
    let arr = [];
    fn(baseDir, arr);
    return {
        basedir: baseDir,
        entry: 'index.js',
        arr
    };
}

exports.getSingleFile = (filename, path) => {
    console.log(baseDir + path + filename);
    let str = fs.readFileSync(baseDir + path + filename, 'utf-8');
    return str;
}

function fn(item, arr) {
    let tempFiles = fs.readdirSync(item); //readdirSync 同步读取文件
    // console.log(q);
    for (let i = 0; i < tempFiles.length; i++) {
        let tempPath = path.join(item, tempFiles[i])
        let dir = fs.statSync(tempPath); //fs.statSync()方法获取路径的详细信息
        // console.log(dir);
        if(dir.isDirectory()){ // isDirectory() 检查是否为文件夹
            fn(tempPath, arr)
        }else{
            let str = fs.readFileSync(tempPath, 'utf-8');
            arr.push({
                name: tempFiles[i],
                path: item.replace(baseDir, '') + '/',
                str: acorn.parse(str, {
                    ecmaVersion: 2020,
                    sourceType: 'module'
                })
            });
        }
    }
}