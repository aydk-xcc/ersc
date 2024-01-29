const fs = require('fs');
const path = require('path')
const baseDir = 'project/'
const acorn = require('acorn');
const fileUtils = require('../utils/fileUtils');


exports.getModuleRealtive = () => {

}

exports.getFiles = (base_dir: string) => {
    let arr: Array<FileData.SingleFile> = [];
    fn(`${baseDir}${base_dir}/`, arr);
    fileUtils.filesSort(arr);
    return {
        basedir: baseDir,
        entry: 'index.js',
        arr
    };
}

exports.getFilesData = () => {
    let arr: Array<FileData.SingleFile> = [];
    fn(baseDir, arr);
    return {
        basedir: baseDir,
        entry: 'index.js',
        arr
    };
}

exports.getSingleFile = (filename: string, path: string) => {
    let str = fs.readFileSync(baseDir + path + filename, 'utf-8');
    return str;
}

function fn(item: string, arr: Array<FileData.SingleFile>) {
    let tempFiles = fs.readdirSync(item); //readdirSync 同步读取文件
    // console.log(q);
    for (let i = 0; i < tempFiles.length; i++) {
        let tempPath = path.join(item, tempFiles[i])
        let dir = fs.statSync(tempPath); //fs.statSync()方法获取路径的详细信息
        // console.log(dir);
        if(dir.isDirectory()){ // isDirectory() 检查是否为文件夹
            let obj: FileData.SingleFile = {
                label: tempFiles[i],
                isDir: true,
                isEntry: false,
                path: tempFiles[i],
                fullPath: tempPath,
                children: []
            };
            arr.push(obj);
            fn(tempPath, obj.children)
        }else{
            let str = fs.readFileSync(tempPath, 'utf-8');
            arr.push({
                label: tempFiles[i],
                path: item.replace(baseDir, '') + '/',
                isDir: false,
                isEntry: false,
                fullPath: tempPath,
                content: acorn.parse(str, {
                    ecmaVersion: 2020,
                    sourceType: 'module'
                })
            });
        }
    }
}