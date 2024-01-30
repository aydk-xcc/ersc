import request from "@/config/request";
import { project } from "@/const/url";
/**
 * 查询所有文件
 */
export const getProjects = (pageNum: Number, pageSize: Number, params?: {} | null) => {
    return request.get(project.projectsUrl, {
        params: {
            ...params,
            pageNum,
            pageSize
        }
    });
}

export const delProject = (id: number) => {
    return request.delete(project.singleProjectsUrl, {
        params: {
            id: id
        }
    });
}

export const addProject = (projectInfo: Project.Project) => {
    request.post(project.projectsUrl, projectInfo);
}

export default {
    getProjects,
    delProject,
    addProject
}