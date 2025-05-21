import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/stores/counterSlice';
import projectReducer from '@/stores/projectSlice';
import type { RootState as RootStateType } from '@/stores/types';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    project: projectReducer,
    // 在这里添加更多的reducer
  },
});

// 从store本身推断出AppDispatch类型
export type AppDispatch = typeof store.dispatch;
export type RootState = RootStateType; 