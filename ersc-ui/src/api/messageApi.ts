import request from "@/config/request";
import { chatUrl } from "@/const/url";

// 消息相关接口类型定义
export interface ChatMessage {
    id?: string;
    content: string;
    role: 'user' | 'assistant';
    sessionId: number;
    timestamp?: string;
}

export interface SendChatMessageRequest {
    content: string;
    chatSessionId: number;
    userId: number;
}

// =============================================================================
// 消息相关API
// =============================================================================

/**
 * 发送消息（用户消息+AI响应）
 * POST /chat
 */
export const sendChatMessage = (data: SendChatMessageRequest) => {
    return request.post(chatUrl.chatUrl, data);
}

/**
 * 获取单条消息
 * GET /chat/:id
 */
export const getChatMessage = (id: string) => {
    return request.get(chatUrl.chatMessageUrl.replace(':id', id));
}

/**
 * 删除单条消息
 * DELETE /chat/:id
 */
export const deleteChatMessage = (id: string) => {
    return request.delete(chatUrl.chatMessageUrl.replace(':id', id));
}

// 默认导出所有消息相关API
export default {
    sendChatMessage,
    getChatMessage,
    deleteChatMessage
} 