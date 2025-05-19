const V1_API = '/api/v1/';

export const fileUrl = {
    filesUrl: V1_API + 'file/files',
    fileUrl: V1_API + 'file/single_file',
    fileUploadsUrl: V1_API + 'file/upload',
    fileRelativeUrl: V1_API + 'file/relative'
}

export const projectUrl = {
    projectsUrl: V1_API + 'projects',
    singleProjectsUrl: V1_API + 'projects/:id'
}

export default {
    fileUrl,
    projectUrl
}