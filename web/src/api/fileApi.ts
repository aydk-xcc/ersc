import request from "@/config/request";
import { fileUrl } from "@/const/url";
/**
 * 查询所有文件
 */
export const getFiles = () => {
    return request.get(fileUrl.filesUrl);
}

/**
 * 查询单个文件
 */
export const getFile = (name: string) => {
    return request.get(fileUrl.fileUrl, {
        params: {
            name: name
        }
    });
}

export default {
    getFiles,
    getFile
}