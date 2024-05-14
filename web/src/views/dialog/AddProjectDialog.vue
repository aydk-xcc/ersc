<script setup lang='ts'>
import { reactive, ref, nextTick } from 'vue';
    import fileApi from '@/api/fileApi';
    import projectApi from '@/api/projectApi';
    import {cloneDeep} from 'lodash-es';
    import fileLimitation from '@/config/file-limitation';
    import {getVersionByPackageJson} from '@/utils/file';
    const dialogVisible = ref(false);
    const submitData = new FormData();
    const formRef = ref(null);
    const formData = reactive({
        name: '',
        entry: '',
        all_rows: '',
        version: '',
        base_dir: ''
    });
    const entryList = ref([]);
    const loading = ref(false);
    const emits = defineEmits([
        'refresh'
    ])

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
        version: [{
            required: true,
            message: '必填'
        }],
        entry: [{
            required: true,
            message: '必填'
        }]
    };

    function handleClose() {
        dialogVisible.value = false;
    }

    async function showDialog() {
        dialogVisible.value = true;
        formData.name = '';
        formData.entry = '';
        formData.all_rows = 0;
        formData.version = '';
        formData.base_dir = '';
        await nextTick();
        formRef.value && formRef.value.clearValidate()
    }

    function addProject() {
        formRef.value && formRef.value.validate().then(async () => {
            try {
                loading.value = true;
                submitData.append('name', formData.name);
                submitData.append('version', formData.version);
                submitData.append('entry', formData.entry);
                const res = await fileApi.uploadFiles(submitData);
                loading.value = false;
                emits('refresh');
                dialogVisible.value = false;
            } catch (error) {
                loading.value = false;
            }
        });
    }

    function handleFileChange(e: BlobEvent) {
      // 处理选择的文件夹中的文件
        let files = e.target.files;
        console.log(files);
        const fileContents = [];
        entryList.value = [];
        for (let i = 0; i < files.length; i++) {
            if (files[i].name === 'package.json') {
                let fileReader = new FileReader();
                fileReader.onload = () => {
                    formData.version = getVersionByPackageJson(fileReader.result);
                }
                fileReader.readAsText(files[i]);
            }
            if (fileLimitation(files[i].webkitRelativePath)) {
                entryList.value.push(files[i].webkitRelativePath);
                submitData.append(files[i].webkitRelativePath.replace('/' + files[i].name, ''), files[i]);
            }
        }
        console.log(entryList);
    }

    defineExpose({
        showDialog
    })
</script>
<template>
    <el-dialog
        v-model="dialogVisible"
        v-loading="loading"
        element-loading-text="Loading..."
        element-loading-background="rgba(255, 255, 255, 0.7)"
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
            <el-form-item label="项目版本" prop="version">
                <el-input v-model="formData.version" />
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