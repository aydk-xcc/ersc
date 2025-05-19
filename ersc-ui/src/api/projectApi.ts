import request from "@/config/request";
import { projectUrl } from "@/const/url";
/**
 * 查询所有文件
 */
export const getProjects = (pageNum?: Number, pageSize?: Number, params?: {} | null) => {
    return request.get(projectUrl.projectsUrl, {
        params: {
            ...params,
            pageNum,
            pageSize
        }
    });
}

export const delProject = (id: number, base_dir: string) => {
    return request.delete(projectUrl.singleProjectsUrl, {
        params: {
            id: id,
            base_dir
        }
    });
}

export const addProject = (projectInfo: Project.Project) => {
    request.post(projectUrl.projectsUrl, projectInfo);
}

export default {
    getProjects,
    delProject,
    addProject
}