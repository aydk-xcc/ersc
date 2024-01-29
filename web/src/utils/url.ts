import {cloneDeep} from 'lodash-es';
export function dealUrlWithParams(url: string, params: object) {
    let tempParams = params;
    if (!url) {
        return '';
    }
    let tempArr = url.split('/');
    tempArr = tempArr.map(item => {
        if (item.includes(':')) {
            let pattern = /:([0-9A-Za-z-_]+)\(?.*/;
            let arr = pattern.exec(item);
            if (arr && arr.length > 1) {
                let value = tempParams[arr[1]];
                delete tempParams[arr[1]];
                return value;
            }
        } else {
            return item;
        }
    });
    // let query = '';
    // if (Object.keys(tempParams || {}).length) {
    //     query = `?${Object.keys(tempParams).map(item => `${item}=${tempParams[item]}`).join('&')}`;
    // }
    return `/${tempArr.filter(item => item).join('/')}`;
}