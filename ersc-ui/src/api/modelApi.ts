import { modelsUrl } from "@/const/url";
import request from "@/config/request";

export const chatMessage = (messages: Array<ModelMessage>, model: string = 'deepseek') => {
    return request.post(modelsUrl.modelUrl, {
        messages
    }, {
        params: {
            provider: model
        }
    });
}

export default {
    chatMessage
}