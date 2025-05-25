import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '@/stores/projectSlice';
import chatReducer from '@/stores/chatSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    // 在这里添加更多的reducer
    chat: chatReducer,
  },
});

// 从store本身推断出AppDispatch类型
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>; 