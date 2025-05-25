import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/stores';

const initialState = {
    chatVisible: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatVisible: (state, action) => {
            state.chatVisible = action.payload;
        },
    },
});

export const { setChatVisible } = chatSlice.actions;
export const selectChatVisible = (state: RootState) => state.chat.chatVisible;
export default chatSlice.reducer;