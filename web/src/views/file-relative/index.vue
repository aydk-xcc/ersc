<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { Graph } from '@antv/x6';
import { MiniMap } from '@antv/x6-plugin-minimap';
import { Scroller } from '@antv/x6-plugin-scroller';
import { DagreLayout } from '@antv/layout';
import fileApi from '@/api/fileApi';
import path from '@/utils/path';
import {filterSameFile} from '@/utils/file';
import { useProjectStore } from '@/stores/project';
import RelativeNode from './RelativeNode.vue';
import { register, getTeleport } from '@antv/x6-vue-shape'
// import { register, getTeleport } from '@antv/x6-vue-shape'

const projectStore = useProjectStore();
const files = ref({arr:[]});
const relativeData = ref([]);
const startY = ref(0);
const graph = ref({});
register({
    shape: 'custom-vue-node',
    width: 140,
    height: 50,
    component: RelativeNode,
})
const TeleportContainer = getTeleport();
const data: {
    nodes: Array<any>,
    edges: Array<any>
} = {
    nodes: [],
    edges: []
}
projectStore.$subscribe((mutation, state) => {
    if (mutation.storeId === 'project') {
        // 修改的是project
        if (state.projectInfo.id) {
            initData();
        }
    }
})

function dealModuleRelative() {
    let arr = dealNodeFloor();
    arr.forEach(item => {
        graph.value.addNode({
            id: item.path,
            shape: 'custom-vue-node',
            x: getX(item),
            width: 140,
            height: 80,
            y: getY(item),
            data: {
                nodeMovable: false,
                nodeInfo: item,
            },
            style: {
                overflow: 'hidden'
            },
            attrs: {
                // "body": {
                //     "refWidth": "140px",
                //     "refHeight": "80px"
                // }
            }
        });
        // data.nodes.push(nodeConfig(item));
        item.imports.forEach(im => {
            graph.value.addEdge({
                shape: 'edge',
                source: item.path,
                target: im.fromFile,
                zIndex: -1,
                attrs: {
                    // line 是选择器名称，选中的边的 path 元素
                    line: {
                        stroke: '#8f8f8f',
                        strokeWidth: 1,
                    },
                }
            })
        });
    })
}

function dealNodeFloor() {
    let tempArr: Array<any> = [];
    let entry = relativeData.value.find(item => item.path === projectStore.projectInfo?.entry);
    if (entry) {
        entry.floor = 0;
        entry.order = 0;
        tempArr.push(entry);
        dealNodeChildFloor(entry, tempArr);
        let floor = 1;
        while(tempArr.find(item => item.floor === floor)) {
            tempArr.filter(item => item.floor === floor).sort((a, b) => {
                return a.imports.length < b.imports.length ? 1 : 0
            }).map((item, index) => {
                item.order = index;
            });
            floor ++;
        }
        console.log(tempArr);
        return tempArr;
    }
}

function dealNodeChildFloor(node: any, arr: Array<any>) {
    if (node.imports?.length) {
        node.imports.forEach(child => {
            let childData = relativeData.value.find(item => item.path === child.fromFile) || {
                name: child.name,
                fromFile: child.name,
                path: child.name,
                is_out: true,
                imports: []
            };
            let childIndex = arr.findIndex(item => item.path === child.fromFile);
            if (childIndex < 0) {
                childData.floor = node.floor + 1;
                arr.push(childData);
                dealNodeChildFloor(childData, arr);
            }
        })
    }
}

function nodeConfig(node: any) {

    return {
        id: node.path,
        shape: 'rect',
        width: 150,
        height: 40,
        x: getX(node),
        y: getY(node),
        label: node.name,
        attrs: {
            // body 是选择器名称，选中的是 rect 元素
            body: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
                rx: 6,
                ry: 6,
            },
        },
        data: {
            nodeMovable: false
        }
    };
}

function getX(node: any) {
    return node.floor * 240 + 50 + Math.ceil(node.order/2)%2 * 10;
}

function getY(node: any) {
    let y = startY.value + Math.ceil(node.order/2) * 120 * (node.order%2 ? -1 : 1);
    if (node.floor > 0) {
        y += (node.floor % 2 ? -1 : 1)*40;
    }
    return y;
}

function initData() {
    fileApi.getFileRelative(projectStore.projectInfo.base_dir, projectStore.projectInfo?.entry).then(res => {
        relativeData.value  = res.data;
        dealModuleRelative();
        graph.value.centerContent() // 居中显示
    })
}

onMounted(async () => {
    startY.value = document.getElementById('container')?.getBoundingClientRect().height/2;
    graph.value = new Graph({
        container: document.getElementById('container')!,
        background: {
            color: '#F2F7FA',
        },
        panning: true,
        autoResize: true,
        interacting: {
            nodeMovable(view) {
                const node = view.cell
                const { nodeMovable } = node.getData() || {}
                return nodeMovable
            },
        },
        grid: {
            visible: true,
            type: 'doubleMesh',
            args: [
            {
                color: '#eee', // 主网格线颜色
                thickness: 1, // 主网格线宽度
            },
            {
                color: '#ddd', // 次网格线颜色
                thickness: 1, // 次网格线宽度
                factor: 4, // 主次网格线间隔
            },
            ],
        }
    })

    graph.value.use(
        new MiniMap({
            container: document.getElementById('minimap'),
        }),
    );

    graph.value.on('node:mouseenter', args => {
        if (graph.value.getConnectedEdges) {
            let edges = graph.value.getConnectedEdges(args.node);
            edges.forEach(edge => {
                edge.attr('line/stroke', 'blue'); // 设置连接线颜色为红色
            });
        }
    });
    graph.value.on('node:mouseleave', args => {
        // console.log(args.node.getConnectedEdges());
        if (graph.value.getConnectedEdges) {
            let edges = graph.value.getConnectedEdges(args.node);
            edges.forEach(edge => {
                edge.attr('line/stroke', '#8f8f8f'); // 设置连接线颜色为红色
            });
        }
    });
    graph.value.on('edge:mouseenter', args => {
        console.log(args);
    });
    initData();
});
</script>
<template>
    <div id="container">
        <!-- <div id="container"></div> -->
        <!-- <TeleportContainer /> -->
    </div>
    <TeleportContainer></TeleportContainer>
    <div id="minimap"></div>
</template>

<style lang="scss" scoped>
    .app-content {
        height: calc(100% - 50px);
    }
    #container {
        flex: 1;
        height: 100%;
        border-radius: 5px;
    }
    #minimap {
        position: absolute;
        right: 0px;
        bottom: 0px;
    }

</style>

<style lang="scss">
    .x6-node foreignObject {
        > body > div {
            // height: 80px !important;
            overflow: hidden !important;
        }
        > body {
            // height: 80px !important;
            overflow: hidden !important;
        }
    }
</style>