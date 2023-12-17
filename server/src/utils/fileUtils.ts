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