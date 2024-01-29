import { defineStore } from "pinia";

interface State {
    projectInfo: Project.Project | null
}

export const useProjectStore = defineStore('project', {
    state: (): State => ({
        projectInfo: null
    }),

    getters: {
        getCUrrentProject: (state): Project.Project | null  => state.projectInfo
    },

    actions: {
        updateCurrentProject(pro: Project.Project) {
            this.projectInfo = pro;
        }
    }
})