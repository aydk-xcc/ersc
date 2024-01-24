import request from "@/config/request";
import { project } from "@/const/url";
/**
 * 查询所有文件
 */
export const getProjects = () => {
    return request.get(project.projectsUrl);
}

export default {
    getProjects
}