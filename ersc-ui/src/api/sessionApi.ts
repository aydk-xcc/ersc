import request from "@/config/request";
import { chatUrl } from "@/const/url";
import type { ChatMessage } from "./messageApi";

// 会话相关接口类型定义
export interface ChatSession {
    id?: string;
    title: string;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
    messageCount?: number;
}

export interface CreateSessionRequest {
    title: string;
    userId: number;
}

export interface UpdateSessionRequest {
    title?: string;
}

export interface SessionWithMessages extends ChatSession {
    messages: ChatMessage[];
}

// =============================================================================
// 会话相关API
// =============================================================================

/**
 * 创建会话
 * POST /chat-session
 */
export const createChatSession = (data: CreateSessionRequest) => {
    return request.post(chatUrl.chatSessionUrl, data);
}

/**
 * 获取用户的所有会话
 * GET /chat-session/user/:userId
 */
export const getUserChatSessions = (userId: string) => {
    return request.get(chatUrl.chatSessionUserUrl.replace(':userId', userId));
}

/**
 * 获取会话（包含所有消息）
 * GET /chat-session/:sessionId
 */
export const getChatSession = (sessionId: number) => {
    return request.get(chatUrl.chatSessionDetailUrl, {
        params: {
            sessionId: sessionId
        }
    });
}

/**
 * 更新会话（支持更新title）
 * PATCH /chat-session/:sessionId
 */
export const updateChatSession = (sessionId: number, title: string) => {
    return request.patch(chatUrl.chatSessionDetailUrl, {
        title: title
    }, {
        params: {
            sessionId: sessionId
        }
    });
}

/**
 * 删除会话
 * DELETE /chat-session/:sessionId
 */
export const deleteChatSession = (sessionId: number) => {
    return request.delete(chatUrl.chatSessionDetailUrl, {
        params: {
            sessionId: sessionId
        }
    });
}

/**
 * 清空会话消息
 * DELETE /chat-session/:sessionId/messages
 */
export const clearChatSessionMessages = (sessionId: number) => {
    return request.delete(chatUrl.chatSessionMessagesUrl, {
        params: {
            sessionId: sessionId
        }
    });
}

// 默认导出所有会话相关API
export default {
    createChatSession,
    getUserChatSessions,
    getChatSession,
    updateChatSession,
    deleteChatSession,
    clearChatSessionMessages
} 