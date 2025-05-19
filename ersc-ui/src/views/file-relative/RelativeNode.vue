<script setup lang='ts'>
    import { computed, defineProps, onMounted, ref, inject } from 'vue';
    // const props = defineProps<{
    //     nodeInfo: any
    // }>();
    const fileType = ref('本地文件');

    const fileName = ref('');

    const fileProcess = ref(0);

    const nodeInfo = ref(null);

    onMounted(() => {
        const getNode = inject('getNode', () => {});
        const node = getNode();
        console.log(node);
        nodeInfo.value = node.store.data.data.nodeInfo;
        fileType.value = nodeInfo.value?.is_out ? '外部依赖' : '本地文件';
        fileName.value = nodeInfo.value?.name;
        fileProcess.value = nodeInfo.value?.fileProcess;
        node.on('change:data', (info) => {
            console.log(info);
        })
    })
</script>
<template>
    <div class="node-info" :class="nodeInfo?.is_out ? 'out' : 'local'">
        <div class="node-type">
            {{ fileType }}
        </div>
        <div class="info">
            <div class="name">{{ fileName }}</div>
            <div class="process">
                <el-progress
                    :text-inside="true"
                    stroke-linecap="butt"
                    :stroke-width="20"
                    :percentage="100"
                    status="success"
                />
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .node-info {
        display: flex;
        background-color: white;
        flex-direction: row;
        border-radius: 4px;
        width: 140px;
        height: 80px;
        .node-type {
            display: flex;
            flex-direction: column;
            width: 24px;
            font-size: 14px;
            line-height: 16px;
            padding: 8px 4px;
            color: white;;
        }
        .info {
            display: flex;
            flex-direction: column;
            width: calc(100% - 24px);
            .name {
                font-size: 12px;
                font-weight: 700;
                text-align: center;
                width: 114px;
                line-height: 60px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                height: 60px;
                align-items: center;
            }
            .process {
                height: 20px;
            }
        }
    }
    .local {
        border: 1px solid #1067EE;
        .node-type {
            background-color: #1067EE;
        }
    }

    .out {
        border: 1px solid #00b96b;
        .node-type {
            background-color: #00b96b;
        }
    }
    :deep(.el-progress-bar__outer), :deep(.el-progress-bar__inner){
        border-radius: 0px !important;
        border: 1px solid transparent;
    }
</style>