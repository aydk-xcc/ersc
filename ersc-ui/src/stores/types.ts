// 定义计数器状态类型
export interface CounterState {
  value: number;
}
// 定义项目状态类型
export interface ProjectState {
  projectInfo: Project.Project | null;
}

// 定义根状态类型
export interface RootState {
  counter: CounterState;
  project: ProjectState;
  // 在这里添加更多状态类型
} 