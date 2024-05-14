
export function filterSameFile(files) {
    // .mjs, cjs.js
    return files.filter(file => {
        if (file.endsWith('.mjs') || file.endsWith('.cjs.js')) {
            let name = file.replace(/(.mjs)|(.cjs.js)/, '');
            return !files.includes(name + '.js');
        }
        return true;
    });
}

export function getVersionByPackageJson(str: string) {
    if (!str) {
        return '';
    }
    try {
        let obj = JSON.parse(str);
        return obj.version || '';
    } catch(e) {
        return '';
    }
}