<script setup lang='ts'>
    import { reactive, ref,  } from 'vue';
    import fileApi from '@/api/fileApi';
    const dialogVisible = ref(false);
    const formData = reactive({
        baseDir: '',
        name: '',
        entry: '',
    });
    function handleClose() {

    }

    function showDialog() {
        dialogVisible.value = true;
    }

    function handleFileChange(e: Event) {
        console.log(e.target.files);
      // 处理选择的文件夹中的文件
        let files = e.target.files;
        const fileContents = [];
        // Object.keys(files).forEach(item => {
        //     const reader = new FileReader();
        //     reader.onload = (event) => {
        //         const content = event.target.result;
        //         fileContents.push(content);
        //         // 如果已经读取完所有文件，更新视图
        //         if (fileContents.length === Object.keys(files).length) {
        //             console.log(fileContents);
        //         }
        //     };
        //     reader.readAsText(files[item]);
        // })

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            console.log(files[i], files[i].path);
            formData.append(files[i].webkitRelativePath.replace('/' + files[i].name, ''), files[i]);
        }
        fileApi.uploadFiles(formData).then(res => {
            console.log(res);
        });

    }

    defineExpose({
        showDialog
    })
</script>
<template>
    <el-dialog
        v-model="dialogVisible"
        title="添加源码项目"
        width="70%"
        :before-close="handleClose"
    >
        <el-form :model="formData" label-width="120px">
            <el-form-item label="项目名称">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="根目录">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="入口文件">
                <el-select v-model="formData.entry" placeholder="please select your zone">
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                </el-select>
            </el-form-item>
            <el-form-item label="上传文件">
                <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileChange"
                    webkitdirectory
                    directory
                    multiple
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                    添加
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<style>
</style>