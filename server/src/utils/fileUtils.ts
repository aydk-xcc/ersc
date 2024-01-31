let fs = require('fs');
const {EXT_TYPE} = require('../const/const');
exports.noExistAndCreate = function(path: string) {
    if (fs.existsSync(path)) {
        return true;
    } else {
        fs.mkdirSync(path, {
            recursive: true
        });
    }
}

exports.existAndDelete = function(path: string) {
    fs.rm(path, {
        recursive: true
    }, (err: any) => {
        console.log(err);
    });
}

exports.filesSort = function(files: Array<FileData.SingleFile>) {
    files.sort((a: FileData.SingleFile, b: FileData.SingleFile) => {
        if (a.isDir && b.isDir) {
        // 都是目录
            return a.label < b.label ? -1: 0;
        } else if (a.isDir || b.isDir) {
            return a.isDir ? -1: 0;
        } else {
            return a.label < b.label ? -1: 0;
        }
    });
    files.forEach(file => {
        if (file.isDir && file.children) {
            this.filesSort(file.children);
        }
    })
}

exports.getFileExt = function(name: string) {
    if (name.endsWith('.js')) {
        return EXT_TYPE.JAVASCRIPT;
    } else if (name.endsWith('.ts')) {
        return EXT_TYPE.TYPESCRIPT;
    }
}