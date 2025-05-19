import { defineStore } from "pinia";
import { localStorage } from "@/utils/localStorage";
import constData from '@/const/const';

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
            localStorage.set(constData.ERSC_LOCAL_STORAGE_KEY, pro.id);
        }
    }
})