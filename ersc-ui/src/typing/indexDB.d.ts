declare namespace IndexDB {
    interface IndexDBConfig {
        name: string;
        version: number;
        db: IDBDatabase | null,
        storeObject: IDBObjectStore| undefined
    }
}