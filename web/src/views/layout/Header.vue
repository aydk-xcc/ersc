<script setup lang='ts'>
    import { reactive, ref, onMounted } from 'vue';
    import projectApi from '@/api/projectApi';
    import {Switch} from '@element-plus/icons-vue';
    import ChangeProject from '@/views/dialog/ChangeProject.vue';
    import avatar from '@/assets/image/avatar.png';
    import logo from '@/assets/image/logo.png';
    import {useProjectStore} from '@/stores/project';
    import {localStorage} from '@/utils/localStorage';
    import constData from '@/const/const';
    const ChangeProjectRef = ref(null);
    const projects = reactive([]);
    let currentProject = reactive({
      id: '',
      name: '',
      base_dir: '',
      all_rows: 0,
      read_rows: 0,
      version: ''
    });
    const projectStore = useProjectStore();

    function changeProject() {
      ChangeProjectRef.value && ChangeProjectRef.value.showDialog(currentProject);
    }

    projectStore.$subscribe((mutation, state) => {
      if (mutation.storeId === 'project') {
        // 修改的是project
        if (state.projectInfo.id) {
          Object.assign(currentProject, state.projectInfo);
        }
      }
    })

    onMounted(() => {
      projectApi.getProjects().then(res => {
        projects.push(...res.data);
        if (projects.length) {
          let localId = localStorage.get(constData.ERSC_LOCAL_STORAGE_KEY);
          if (localId) {
            let obj = projects.find(item => item.id === + localId);
            Object.assign(currentProject, obj);
          } else {
            Object.assign(currentProject, projects[0]);
          }
          projectStore.updateCurrentProject(currentProject);
        } 
        localStorage.set(constData.ERSC_LOCAL_STORAGE_KEY, currentProject.id);
        emits('currentProject', currentProject);
      })
    })

    const emits = defineEmits([
      'currentProject'
    ])
</script>
<template>
    <el-header class="header">
      <div>
        <div class="title">
          <img style="width: 70px;height: 30px" :src="logo"/>
          <span v-if="currentProject.id"> ｜ </span>  
          <span v-if="currentProject.id" class="pro-name" @click="changeProject">
             {{ currentProject.name }}({{ currentProject.version }})
            <el-icon><Switch /></el-icon>
          </span>
        </div>
        <div class="message">easy read source code</div>
      </div>
      <div>
        <el-avatar shape="square" :size="35" fit="fill" :src="avatar" />
      </div>
      <ChangeProject
        ref="ChangeProjectRef"
      />
    </el-header>
</template>
<style lang="scss" scoped>
  .title {
    display: flex;
    flex-direction: row;
    font-size: 16px;
    font-weight: bold;
    span {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .pro-name {
      background-color: rgba(244, 244,244, .3);
      padding: 0 10px;
      border-radius: 2px;
      font-size: 14px;
    }
    .el-icon {
      margin-left: 8px;
      font-size: 14px;
    }
  }

  .message {
    font-size: 14px;
  }
</style>