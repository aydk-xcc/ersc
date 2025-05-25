import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ERSC_LOCAL_STORAGE_KEY, ERSC_LOCAL_STORAGE_KEY_PROJECT_INFO } from '@/const/const';
import type { RootState } from '@/stores';

// 定义项目状态类型
export interface ProjectState {
  projectInfo: Project.ProjectInfo | null;
}

// 从localStorage获取初始projectInfo
const getInitialProjectInfo = (): Project.ProjectInfo | null => {
  try {
    const savedProject = localStorage.getItem(ERSC_LOCAL_STORAGE_KEY);
    if (savedProject) {
      return JSON.parse(savedProject);
    }
  } catch (error) {
    console.error('Error loading project from localStorage:', error);
  }
  return null;
};

// 定义初始状态
const initialState: {
  projectInfo: Project.ProjectInfo | null;
} = {
  projectInfo: getInitialProjectInfo(),
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    updateCurrentProject: (state, action: PayloadAction<Project.ProjectInfo>) => {
      state.projectInfo = action.payload;
      localStorage.setItem(ERSC_LOCAL_STORAGE_KEY, JSON.stringify(action.payload));
    },
    updateProjectInfo: (state, action: PayloadAction<Project.ProjectInfo>) => {
      state.projectInfo = action.payload;
      // 可以在这里添加localStorage相关逻辑，或使用中间件处理
      try {
        let localCode = localStorage.getItem(ERSC_LOCAL_STORAGE_KEY_PROJECT_INFO);
        if (!localCode) {
          localStorage.setItem(ERSC_LOCAL_STORAGE_KEY_PROJECT_INFO, JSON.stringify({
            [action.payload.name]: {
              [action.payload.version]: {
                [action.payload.currentType]: {},
              },
            },
          }));
        } else {
          let localCodeObj = JSON.parse(localCode);
          if (localCodeObj[action.payload.name]) {
            if (localCodeObj[action.payload.name][action.payload.version]) {
              if (localCodeObj[action.payload.name][action.payload.version][action.payload.currentType]) {
                localCodeObj[action.payload.name][action.payload.version][action.payload.currentType] = {};
              } else {
                localCodeObj[action.payload.name][action.payload.version][action.payload.currentType] = {};
              }
            } else {
              localCodeObj[action.payload.name][action.payload.version] = {
                [action.payload.currentType]: {},
              };
            }
          } else {  
            localCodeObj[action.payload.name] = {
              [action.payload.version]: {
                [action.payload.currentType]: {},
              },
            };
          }
          localStorage.setItem(ERSC_LOCAL_STORAGE_KEY_PROJECT_INFO, JSON.stringify(localCodeObj));
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