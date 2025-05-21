declare namespace FileData {
    interface SingleFile {
        label: string;
        path: string;
        fullPath: string;
        isDir: boolean;
        precess?: number;
        children?: Array<SingleFile>;
    }
}