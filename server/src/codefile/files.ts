const fs = require('fs');
const path = require('path')
const baseDir = 'example/vuex/'
const acorn = require('acorn');
// declare namespace FileData {
//     interface SingleFile {
//         name: string;
//         path: string;
//         fullPath: string;
//         content?: string;
//         isEntry?: boolean;
//         isDir: boolean;
//         precess?: number;
//         children?: Array<SingleFile>
//     }
// }


exports.getModuleRealtive = () => {

}

exports.getFiles = () => {
    let arr: Array<FileData.SingleFile> = [];
    fn(baseDir, arr);
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
    console.log(baseDir + path + filename);
    let str = fs.readFileSync(baseDir + path + filename, 'utf-8');
    return str;
}

function fn(item: string, arr: Array<FileData.SingleFile>) {
    let tempFiles = fs.readdirSync(item); //readdirSync 同步读取文件
    console.log(tempFiles);
    // console.log(q);
    for (let i = 0; i < tempFiles.length; i++) {
        let tempPath = path.join(item, tempFiles[i])
        let dir = fs.statSync(tempPath); //fs.statSync()方法获取路径的详细信息
        // console.log(dir);
        if(dir.isDirectory()){ // isDirectory() 检查是否为文件夹
            let obj: FileData.SingleFile = {
                name: tempPath,
                isDir: true,
                isEntry: false,
                path: tempPath,
                fullPath: '',
                children: []
            };
            arr.push(obj);
            fn(tempPath, obj.children)
        }else{
            let str = fs.readFileSync(tempPath, 'utf-8');
            arr.push({
                name: tempFiles[i],
                path: item.replace(baseDir, '') + '/',
                isDir: false,
                isEntry: false,
                fullPath: '',
                content: acorn.parse(str, {
                    ecmaVersion: 2020,
                    sourceType: 'module'
                })
            });
        }
    }
}