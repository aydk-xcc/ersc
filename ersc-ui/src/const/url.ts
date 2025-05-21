const V1_API = '/api/v1/';

export const fileUrl = {
    filesUrl: V1_API + 'file/files',
    fileUrl: V1_API + 'file/single_file',
    fileUploadsUrl: V1_API + 'file/upload',
    fileRelativeUrl: V1_API + 'file/relative'
}

export const projectUrl = {
    projectsUrl: V1_API + 'projects',
    projectVersionUrl: V1_API + 'projects/:name',
    projectFileListUrl: V1_API + 'projects/:name/:version/:type',
    projectFileUrl: V1_API + 'projects/:name/:version/:type/file'
}

export default {
    fileUrl,
    projectUrl
}