const fs = require('fs');
const path = require('path');
const parse = require('@babel/parser');
const fileUtils = require('../../utils/fileUtils');
const {BASE_DIR} = require('../../const/const');

exports.getFiles = (pro_dir: string) => {
    let arr: Array<FileData.SingleFile> = [];
    fn(`${pro_dir}/`, arr);
    fileUtils.filesSort(arr);
    return arr;
}

exports.getSingleFile = (path: string) => {
    let str = fs.readFileSync(BASE_DIR + '/' + path, 'utf-8');

    return {
        str,
        ast: parse.parse(str, {
            sourceType: "module",
            plugins: [
                // enable jsx and flow syntax
                "typescript",
            ],
        })
    };
}

function fn(currentPath: string, arr: Array<FileData.SingleFile>) {
    try {
        let tempFiles = fs.readdirSync(path.join(BASE_DIR, currentPath)); //readdirSync 同步读取文件
        for (let i = 0; i < tempFiles.length; i++) {
            let tempPath = path.join(currentPath, tempFiles[i])
            let dir = fs.statSync(path.join(BASE_DIR, tempPath)); //fs.statSync()方法获取路径的详细信息
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
                    path: currentPath + '/',
                    isDir: false,
                    fullPath: tempPath
                });
            }
        }
    } catch (e) {
        
    }
}