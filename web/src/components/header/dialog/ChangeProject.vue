<script setup lang='ts'>
    import { reactive, ref } from 'vue';
    import projectApi from '@/api/projectApi';
    import Table from '@/components/table/Table.vue'
    import {useProjectStore} from '@/stores/project';
    import projectColumn from '@/components/header/config/projectColumn';
    import AddProjectDialog from '@/components/header/dialog/AddProjectDialog.vue';

    const dialogVisible = ref(false);
    const AddProjectDialogRef = ref(null);
    const projects = ref([]);
    const tableConfig = reactive({
        refresh: true,
        maxHeight: 'calc(100vh - 175px)',
        showOp: true,
        showIndex: true,
        hiddenPagination: true
    });
    const current = reactive({
        id: ''
    });

    const store = useProjectStore();


    function handleClose() {
        dialogVisible.value = false;
    }

    function showDialog(project) {
        dialogVisible.value = true;
        current.id = project.id;
    }

    function changeProject(row) {
        current.id = row.id;
        store.updateCurrentProject(row);
    }

    function deleteProject(row) {
        projectApi.delProject(row.id).then(res => {
            console.log(res);
        })
    }

    function addProject() {
        AddProjectDialogRef.value && AddProjectDialogRef.value.showDialog();
    }

    defineExpose({
        showDialog
    })
</script>
<template>
    <el-dialog
        v-model="dialogVisible"
        title="切换项目"
        width="75%"
        :before-close="handleClose"
    >
        <Table
            :api="projectApi.getProjects"
            :table-config="tableConfig"
            :table-column="projectColumn"
        >
            <template v-slot:header-left>
                <el-button type="primary" size="small" @click="addProject">新增源码</el-button>
                <AddProjectDialog
                    ref="AddProjectDialogRef"
                />
            </template>
            <template v-slot:name="scope">
                {{ scope.row.name }}
                <el-tag 
                    v-if="current.id === scope.row.id"
                    size="small"
                    round
                >now</el-tag>
            </template>
            <template v-slot:operate="scope">
                <el-button 
                    link 
                    type="primary" 
                    size="small" 
                    @click="changeProject(scope.row)"
                >切换</el-button>
                <el-button
                    link 
                    type="primary" 
                    size="small" 
                    @click="addIcafe(scope.row)"
                >编辑</el-button>
                <el-button
                    link
                    type="primary" 
                    size="small"
                    @click="deleteProject(scope.row)"
                >删除</el-button>
            </template>
        </Table>
        <template #footer>
        <span class="dialog-footer">
            <el-button
                @click="dialogVisible = false"
            >关闭</el-button>
        </span>
        </template>
    </el-dialog>
</template>
<style lang="scss" scoped>
    .projects {
        display: flex;
        flex-direction: column;
        width: 100%;
        .head {
            background-color: #f0f0f0;
        }
        .item {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            height: 45px;
        }
    }
</style>