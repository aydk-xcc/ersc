import request from "@/config/request";
import { projectUrl } from "@/const/url";
/**
 * 查询所有文件
 */
export const getProjects = () => {
    return request.get(projectUrl.projectsUrl);
}

export const getProjectVersions = (name: string) => {
    return request.get(projectUrl.projectVersionUrl, {
        params: {
            name
        }
    });
}

export const getProjectFileList = (name: string, version: string, type: string) => {
    return request.get(projectUrl.projectFileListUrl, {
        params: {
            name,
            version,
            type
        }
    });
}

/**
 * 查询单个文件
 */
export const getFile = (name: string, version: string, type: string, path: string) => {
    return request.get(projectUrl.projectFileUrl, {
        params: {
            name,
            version,
            type,
            path
        }
    });
}

export default {    
    getProjects,
    getProjectVersions,
    getProjectFileList,
    getFile
}