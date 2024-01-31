function isEmptyLine(line: string) {
    return line === '';
}

function isAnnotation(line: string) {
    // // 开头
    return line.startsWith('//') || line.startsWith('/*') || line.startsWith('*');
}

function computeJavascriptRows(str: string) {
    let arr = str.split('\n');
    let total = 0, start = 0;
    let isAnnotationBlock = false; // 来处理 /** 中间包裹的但是却没有以*开头的行 */
    while(start < arr.length) {
        let line = arr[start].trim();
        if (!isEmptyLine(line)) {
            // 是否是空行
            if (!isAnnotation(line)) {
                total++;
            } else {
                isAnnotationBlock = true;
            }
        }
        start++;
    }
    return total;
}

module.exports = computeJavascriptRows;