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
export const getFile = (name: string, path: string) => {
    return request.get(fileUrl.fileUrl, {
        params: {
            name: name,
            path
        }
    });
}

export const uploadFiles = (formdata:FormData) => {
    console.log(formdata);
    return request.post(fileUrl.fileUploadsUrl, formdata, {
        headers: {
            "Content-Type": 'multipart/form-data'
        }
    });
}

export default {
    getFiles,
    getFile,
    uploadFiles
}