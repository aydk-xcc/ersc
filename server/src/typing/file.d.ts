declare namespace FileData {
    interface SingleFile {
        label: string;
        path: string;
        fullPath: string;
        content?: string;
        isEntry?: boolean;
        isDir: boolean;
        precess?: number;
        children?: Array<SingleFile>;
    }
}