/**
 * Storage的操作工具函数的封装，避免每次使用重复调用json操作
 * 包括localStorage和sessionStorage
 * */
export let localStorage = {
    set: (key, value) => {},
    get: (key) => {},
    remove: (key) => {},
    setList: (key) => {},
    removeList: (key) => {}
};
export let sessionStorage = {
    set: (key, value) => {},
    get: (key) => {},
    remove: (key) => {},
    setList: (key) => {},
    removeList: (key) => {}
};
// 存数据
localStorage.set = function (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
};
sessionStorage.set = function (key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
};

// 获取本地数据
localStorage.get = function (key) {
    let val = window.localStorage.getItem(key);
    return JSON.parse(val);
};
sessionStorage.get = function (key) {
    let val = window.sessionStorage.getItem(key);
    return JSON.parse(val);
};

// 清除本地数据
localStorage.remove = function (key) {
    if (key) {
        window.localStorage.removeItem(key);
        return true;
    }
    return false;
};
sessionStorage.remove = function (key) {
    if (key) {
        window.sessionStorage.removeItem(key);
        return true;
    }
    return false;
};

// 批量存
localStorage.setList = function (data) {
    if (Object.prototype.toString.call(data) === '[object Object]') {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                localStorage.set(key, data[key]);
            }
        }
        return true;
    }
    return false;
};
sessionStorage.setList = function (data) {
    if (Object.prototype.toString.call(data) === '[object Object]') {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                sessionStorage.set(key, data[key]);
            }
        }
        return true;
    }
    return false;
};

// 批量清除
localStorage.removeList = function (list) {
    if (Array.isArray(list)) {
        for (let i = 0, len = list.length; i < len; i++) {
            localStorage.remove(list[i]);
        }
        return true;
    }
    return false;
};
sessionStorage.removeList = function (list) {
    if (Array.isArray(list)) {
        for (let i = 0, len = list.length; i < len; i++) {
            sessionStorage.remove(list[i]);
        }
        return true;
    }
    return false;
};
