const fs = require('fs');
const path = require('path')
const baseDir = 'example/vuex/'
exports.getFiles = () => {
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
    let q = fs.readdirSync(item); //readdirSync 同步读取文件
    // console.log(q);
    for (let i = 0; i < q.length; i++) {
        let item1 = path.join(item,q[i])
        let dir = fs.statSync(item1); //fs.statSync()方法获取路径的详细信息
        // console.log(dir);
        if(dir.isDirectory()){ // isDirectory() 检查是否为文件夹
            fn(item1, arr)
        }else{
            arr.push({
                name: q[i],
                path: item.replace(baseDir, '')
            });
        }
    }
}