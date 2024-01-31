const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const fileUtils = require('../utils/fileUtils');
const {BASE_DIR} = require('../const/const');

exports.getFiles = (pro_dir: string) => {
    let arr: Array<FileData.SingleFile> = [];
    fn(`${BASE_DIR}/${pro_dir}/`, arr);
    fileUtils.filesSort(arr);
    return arr;
}

exports.getSingleFile = (filename: string, path: string) => {
    let str = fs.readFileSync(BASE_DIR + path + filename, 'utf-8');
    return str;
}

function fn(currentPath: string, arr: Array<FileData.SingleFile>) {
    try {
        let tempFiles = fs.readdirSync(currentPath); //readdirSync 同步读取文件
        for (let i = 0; i < tempFiles.length; i++) {
            let tempPath = path.join(currentPath, tempFiles[i])
            let dir = fs.statSync(tempPath); //fs.statSync()方法获取路径的详细信息
            // console.log(dir);
            if(dir.isDirectory()){ // isDirectory() 检查是否为文件夹
                let obj: FileData.SingleFile = {
                    label: tempFiles[i],
                    isDir: true,
                    path: tempFiles[i],
                    fullPath: tempPath,
                    children: []
                };
                arr.push(obj);
                fn(tempPath, obj.children)
            }else{
                arr.push({
                    label: tempFiles[i],
                    path: currentPath.replace(BASE_DIR, '') + '/',
                    isDir: false,
                    fullPath: tempPath
                });
            }
        }
    } catch (e) {
        
    }
}