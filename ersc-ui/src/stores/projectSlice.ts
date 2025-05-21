import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/stores/types';

// 定义项目状态类型
export interface ProjectState {
  projectInfo: Project.ProjectInfo | null;
}

// 定义初始状态
const initialState: {
  projectInfo: Project.ProjectInfo | null;
} = {
  projectInfo: null,
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    updateCurrentProject: (state, action: PayloadAction<Project.ProjectInfo>) => {
      state.projectInfo = action.payload;
      // 可以在这里添加localStorage相关逻辑，或使用中间件处理
      try {
        const name = action.payload.name || action.payload.name;
        if (name) {
          localStorage.setItem('ERSC_LOCAL_STORAGE_KEY', name);
        }
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
  },
});

// 导出actions
export const { updateCurrentProject } = projectSlice.actions;

// 选择器函数
export const selectCurrentProject = (state: RootState) => state.project.projectInfo;

// 导出reducer
export default projectSlice.reducer; 