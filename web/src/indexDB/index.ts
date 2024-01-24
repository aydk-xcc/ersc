const erscDB: IndexDB.IndexDBConfig = {
    name: 'erscDB',
    version: 2,
    db: null,
    storeObject: undefined
};
export default {
    openDB(storeName?: string, callback?: Function) {
        let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        if (!indexedDB) {
            console.error('浏览器不支持indexedDB');
        }
        const result = indexedDB.open(erscDB.name, erscDB.version);
        //错误
        result.onerror = function(e){
            console.log("Open DB Error!");
        };
  
        //正确打开
        result.onsuccess = function(e: Event){
            console.log(e);
            erscDB.db = (e.target as IDBRequest).result ;
            console.log(erscDB);
        };
  
        //数据库版本变更
        result.onupgradeneeded = function(e){
            console.log(e);
            erscDB.db = (e.target as IDBRequest).result;
            if(!erscDB.db?.objectStoreNames.contains('project')){
                erscDB.db?.createObjectStore('project',{keyPath: "id"});
            }
            if (callback) {
                callback(storeName);
            }
        };
    },

    checkAndCreate(storeName: string) {
        // 更新版本号
        if (!erscDB.db?.objectStoreNames.contains(storeName)) {
            erscDB.version++;
            this.openDB(storeName, function(storeName: string) {
                erscDB.storeObject =  erscDB.db?.createObjectStore(storeName, { keyPath: 'id', autoIncrement: false });
            })
        } else {
            erscDB.storeObject = erscDB.db?.transaction([storeName], 'readwrite').objectStore(storeName);
        }
    },

    

    get(key: string) {
        return new Promise((resolve, reject) => {
            let indexedDB = this.getStorage();
            if (indexedDB) {
                let request = indexedDB.open('tianniu');
                // 接上面的代码
                request.onsuccess = function (event) {
                    let db = event.target.result;
                    let transaction = db.transaction([key]);
                    let objectStore = transaction.objectStore(key);
                    let data = objectStore.get(0);
                    data.onsuccess = function (e) {
                        resolve(e.target.result);
                    };
                };
            }
        });
    },

    set(key: string, value: string) {
        let indexedDB = this.getStorage();
        if (indexedDB) {
            let request = indexedDB.open('tianniu');
            // 接上面的代码
            request.onsuccess = function (event) {
                let db = event.target.result;
                let transaction = db.transaction([key], 'readwrite');
                let objectStore = transaction.objectStore(key);
                let data = objectStore.get(0);
                data.onsuccess = function (e) {
                    // 获取我们想要更新的数据
                    let result = e.target.result;
                    if (result) {
                        result.value = value;
                        objectStore.put(result);
                    } else {
                        objectStore.add({
                            id: 0,
                            date: new Date(),
                            value: value
                        });
                    }
                };
            };
        }
    }
};
