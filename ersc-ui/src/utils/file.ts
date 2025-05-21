export function getFileExt(fileName: string) {
    return fileName.split('.').pop() || '';
}

export function isDir(filePath: string) {
    return filePath.endsWith('/');
}