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

export const modelsUrl = {
    modelUrl: V1_API + 'models/chat'
}

export const chatUrl = {
    // 消息相关接口
    chatUrl: V1_API + 'chat',
    chatMessageUrl: V1_API + 'chat/:id',
    
    // 会话相关接口
    chatSessionUrl: V1_API + 'chat-session',
    chatSessionUserUrl: V1_API + 'chat-session/user/:userId',
    chatSessionDetailUrl: V1_API + 'chat-session/:sessionId',
    chatSessionMessagesUrl: V1_API + 'chat-session/:sessionId/messages'
}

export default {
    fileUrl,
    projectUrl,
    modelsUrl,
    chatUrl
}