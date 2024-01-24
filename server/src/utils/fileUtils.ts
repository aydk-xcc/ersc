let fs = require('fs');
exports.noExitAndCreate = function(path: string) {
    if (fs.existsSync(path)) {
        return true;
    } else {
        fs.mkdirSync(path, {
            recursive: true
        });
    }
}

exports.filesSort = function(files: Array<FileData.SingleFile>) {
    console.log(files);
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
    console.log(files);
}