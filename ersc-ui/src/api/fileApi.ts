import request from "@/config/request";
import { fileUrl } from "@/const/url";
/**
 * 查询所有文件
 */
export const getFiles = (base_dir: string) => {
    return request.get(fileUrl.filesUrl, {
        params: {
            base_dir
        }
    });
}

export const getFileRelative = (base_dir: string, entry: string) => {
    return request.get(fileUrl.fileRelativeUrl, {
        params: {
            base_dir,
            entry
        }
    });
}

/**
 * 查询单个文件
 */
export const getFile = (path: string) => {
    return request.get(fileUrl.fileUrl, {
        params: {
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
    uploadFiles,
    getFileRelative
}