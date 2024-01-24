<script setup lang='ts'>
    import { reactive, ref } from 'vue';
    import projectApi from '@/api/projectApi';
    import Table from '@/components/table/Table.vue'
    import projectColumn from '@/components/header/config/projectColumn';

    const dialogVisible = ref(false);
    const projects = ref([]);
    const tableConfig = reactive({
        refresh: true,
        maxHeight: 'calc(100vh - 175px)',
        showOp: true,
        showIndex: true,
        hiddenPagination: true
    });


    function handleClose() {
        dialogVisible.value = false;
    }

    function showDialog() {
        dialogVisible.value = true;
        projectApi.getProjects().then(res => {
            projects.value = [];
            projects.value.push(...res.data);
            console.log(projects);
        })
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
                <el-button type="primary" size="small" @click="addDuty">新增源码</el-button>
            </template>
            <template v-slot:operate="scope">
                <el-button 
                    link 
                    type="primary" 
                    size="small" 
                    @click="showDutyRecord(scope.row)"
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
                    @click="showIcafe(scope.row)"
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