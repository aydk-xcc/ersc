<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { Refresh, Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs';

    interface columnUnit {
        label: string;
        tooltips?: boolean;
        prop: string;
        date?: boolean;
        searchForm?: string;
        width?: number;
        minWidth?: number;
    }

    interface TableConfig {
        searchKey?: string;
        searchPlaceholder?: string;
        refresh?: boolean;
        maxHeight?: string;
        showOp?: boolean;
        showIndex?: boolean;
        params: object;
        showBorder?: boolean;
        rowClassName: Function;
    }

    const props = defineProps<{
        api: Function,
        tableConfig: TableConfig,
        tableColumn: Array<columnUnit>,
        tableData: Array<any>
    }>();
    const currentTableData = ref(props.tableData);
    const searchText = ref('');
    const pagination = reactive({
        total: 0,
        pageNum: 1,
        pageSize: 20
    });
    const searchFormConfig:Array<columnUnit> = reactive([]);
    const loading = ref(false);
    const small = ref(false)
    const background = ref(false)
    const disabled = ref(false)
    const filterObj = ref({});
    const searchObj = ref({});
    const emits = defineEmits(['currentParams']);


    function refresh() {
        if (props.api) {
            let params: any = {};
            if (props.tableConfig.searchKey && searchText.value) {
                params[`search_${props.tableConfig.searchKey}`] = searchText.value;
            }
            if (props.tableConfig.params) {
                Object.assign(params, props.tableConfig.params);
            }
            if (Object.keys(searchObj.value).length) {
                let tempObj = {};
                Object.keys(searchObj.value).forEach(item => {
                    if (Object.prototype.toString.call(searchObj.value[item]) === '[object Array]') {
                        tempObj[item] = searchObj.value[item].join();
                    } else if (searchObj.value[item] || searchObj.value[item] === 0){
                        tempObj[item] = searchObj.value[item];
                    }
                })
                Object.assign(params, tempObj);
            }
            Object.assign(params, filterObj.value);
            emits('currentParams', params);
            loading.value = true;
            props.api(pagination.pageNum, pagination.pageSize, params).then(res=> {
                currentTableData.value = res.data;
                if (res.pagination) {
                    pagination.total = res.pagination.records;
                }
            }).finally(() => {
                loading.value = false;
            })
        }
    }

    function indexMethod(index: number) {
        return (pagination.pageNum - 1) * pagination.pageSize + index + 1;
    }

    function filterChange(filters) {
        if (props.api) {
            Object.keys(filters).forEach(key => {
                if (filters[key].length) {
                    filterObj.value[key] = filters[key][0];
                } else {
                    delete filterObj.value[key];
                }
            })
            refresh();
        }
    }

    onMounted(() => {
        (props.tableColumn || []).forEach(item => {
            if (item.searchForm) {
                searchFormConfig.push(item);
                searchObj.value[item.prop] = '';
            }
        })
        refresh();
    })

     // 监视父组件传递的数组变化
     watch(() => props.tableData, (newValue, oldValue) => {
      currentTableData.value = [...newValue]; // 更新本地数据
    });


    defineExpose({
        refresh
    });

</script>
<template>
    <div class="header">
        <div class="left">
            <slot name="header-left">

            </slot>
        </div>
        <div>
            <div
                v-for="(item, index) in searchFormConfig"
                :key="item.prop + '#' + index"
            >
                <span class="mr-2">{{ item.label }}</span>
                <el-date-picker
                    v-model="searchObj[item.prop]"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    size="small"
                    value-format="YYYY/MM/DD"
                    @change="refresh"
                />
            </div>
        </div>
        <div class="d-flex flex-row">
            <el-input
                v-if="tableConfig.searchKey"
                v-model="searchText"
                class="w-100 m-2"
                :placeholder="tableConfig.searchPlaceholder || '输入搜索内容...'"
                :suffix-icon="Search"
                @keyup.enter.native="refresh"
            />
            <el-button
                v-if="tableConfig.refresh"  
                link
                type="primary"
                size="small"
                :icon="Refresh" 
                @click="refresh"
            >刷新</el-button>
            <slot name="header-right">
            </slot>
        </div>
    </div>
    <el-table
        class="mt-2"
        v-loading="loading"
        :data="currentTableData"
        :border="tableConfig.showBorder"
        :height="tableConfig.maxHeight"
        :row-class-name="tableConfig.rowClassName"
        style="width: 100%"
        :show-overflow-tooltip="true"
        @filter-change="filterChange"
    >
        <el-table-column
            v-if="tableConfig.showIndex"
            fixed
            type="index"
            width="80"
            :index="indexMethod"
        >
        </el-table-column>
        <el-table-column
            v-for="(item, index) in tableColumn"
            :key="`${index}#${item.prop}`"
            :column-key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :show-overflow-tooltip="item.tooltips"
            :filters="item.filters"
            :filter-multiple="!!item.filterMultiple"
        >
            <template v-if="item.slot" #default="scope">
                <slot :name="item.slot || item.prop" :row="scope.row"></slot>
            </template>
            <template v-else-if="item.date" #default="scope">
                {{ dayjs(scope.row[item.prop]).format('YYYY/MM/DD') }}
            </template>
            <template v-else-if="item.datetime" #default="scope">
                {{ dayjs(scope.row[item.prop]).format('YYYY/MM/DD HH:mm:ss') }}
            </template>
        </el-table-column>
        <el-table-column
            v-if="tableConfig.showOp"
            fixed="right"
            label="操作"
            width="140"
        >
            <template #default="scope">
                <slot name="operate" :row="scope.row"></slot>
            </template>
        </el-table-column>
    </el-table>
    <div v-if="!tableConfig.hiddenPagination" class="d-flex mt-2 justify-content-end">
        <el-pagination
            v-model:current-page="pagination.pageNum"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :small="small"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next"
            :total="pagination.total"
            @size-change="refresh"
            @current-change="refresh"
        />
    </div>
</template>
<style lang="scss" scope>
    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .left {
        display: flex;
        flex-direction: row;
        align-items: center;
        .upload {
            display: flex;
        }
        }
    }
    :deep(.cell) {
        word-break: break-all;
        white-space: pre-wrap;
        max-height: 160px;
        overflow-y: scroll;
    }

    :deep(.el-popper) {
        max-width: 600px !important;
    }
</style>