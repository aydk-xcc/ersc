<script setup lang='ts'>
    import { reactive, ref,  } from 'vue';
    import fileApi from '@/api/fileApi';
    import projectApi from '@/api/projectApi';
    const dialogVisible = ref(false);
    const submitData = new FormData();
    const formRef = ref(null);
    const formData = reactive({
        name: '',
        entry: ''
    });

    const rules = {
        name: [{
            required: true,
            message: '必填'
        }, {
            validator: async (rule, value, callback) => {
                if (value) {
                    let pros = await projectApi.getProjects(
                        0, 0,
                        {
                            name: value
                        });
                    console.log(pros.data);
                    if (pros.data && pros.data.length) {
                        callback(new Error(`已存在项目${value}`));
                    }
                    callback();
                } else {
                    callback();
                }
            },
            trigger: 'blur'
        }],
        entry: [{
            required: true,
            message: '必填'
        }]
    };

    const entryList = ref([]);
    function handleClose() {

    }

    function showDialog() {
        dialogVisible.value = true;
    }

    function addProject() {
        formRef.value && formRef.value.validate().then(res => {
            // submitData.append('name', formData.name);
            // submitData.append('entry', formData.name);

            fileApi.uploadFiles(submitData).then(res => {
                console.log(res);
            });
        })
    }

    function handleFileChange(e: Event) {
        console.log(e.target.files);
      // 处理选择的文件夹中的文件
        let files = e.target.files;
        const fileContents = [];
        entryList.value = [];
        for (let i = 0; i < files.length; i++) {
            entryList.value.push(files[i].webkitRelativePath);
            submitData.append('_ersc_file/' + files[i].webkitRelativePath.replace('/' + files[i].name, ''), files[i]);
        }

    }

    defineExpose({
        showDialog
    })
</script>
<template>
    <el-dialog
        v-model="dialogVisible"
        title="添加源码项目"
        width="75%"
        append-to-body
        :before-close="handleClose"
    >
        <el-form
            ref="formRef"
            :model="formData" 
            label-width="120px"
            :rules="rules"
        >
            <el-form-item label="项目名称" prop="name">
                <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="入口文件" prop="entry">
                <el-select 
                    v-model="formData.entry" 
                    placeholder="选择入口文件"
                    filterable
                >
                    <el-option 
                        v-for="(item, index) in entryList"
                        :key="index"
                        :label="item"
                        :value="item"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="上传文件">
                <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileChange"
                    webkitdirectory
                    multiple
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addProject">
                    添加
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<style>
</style>