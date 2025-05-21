import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CounterState, RootState } from '@/stores/types';

// 定义初始状态
const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// 导出actions
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 选择器函数，用于从状态中获取计数值
export const selectCount = (state: RootState) => state.counter.value;

// 导出reducer
export default counterSlice.reducer; 