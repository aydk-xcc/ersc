<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import ProgressNode from '../graph-view/ProgressNode.vue'
import { Graph } from '@antv/x6';
import { DagreLayout } from '@antv/layout';
import fileApi from '@/api/fileApi';
import path from '@/utils/path';
import {filterSameFile} from '@/utils/file';
// import { register, getTeleport } from '@antv/x6-vue-shape'

// console.log(graph);
// register({
//     shape: 'custom-vue-node',
//     width: 100,
//     height: 100,
//     component: ProgressNode,
// })
// const TeleportContainer = getTeleport()
const files = ref({arr:[]});
const data = {
    nodes: [],
    edges: []
}

function dealModuleRelative(obj) {
    let fileList = [];
    obj.arr.forEach(file => {
        fileList.push((obj.basedir + file.path + file.name).replace(/\/\//g, '/'));
    }); // 遍历文件
    fileList = filterSameFile(fileList);
    obj.arr.forEach((file, index) => {
        let current = (obj.basedir + file.path + file.name).replace(/\/\//g, '/')
        if (fileList.includes(current)) {
            data.nodes.push({
                id: current,
                shape: 'rect',
                width: 150,
                height: 40,
                label: file.name,
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
                    // nodeMovable: false
                }
            });
            file.str.body.forEach(node => {
                if (node.type === "ImportDeclaration" && node.source.value.includes('/')) {
                    console.log(node.source.value, path.resolve(current, node.source.value));
                    let sourceId = path.resolve(current, node.source.value) + '.js';
                    if (fileList.includes(sourceId)) {
                        data.edges.push({
                            shape: 'edge',
                            source: path.resolve(current, node.source.value) + '.js',
                            target: current,
                            label: '',
                            attrs: {
                                // line 是选择器名称，选中的边的 path 元素
                                line: {
                                    stroke: '#8f8f8f',
                                    strokeWidth: 1,
                                },
                            },
                        });
                    }
                }
            })
        }
    });
    

}

onMounted(async () => {
    const graph = new Graph({
        container: document.getElementById('container')!,
        background: {
            color: '#F2F7FA',
        },
        panning: {
            enabled: true,
            modifiers: 'shift'
        },
        autoResize: true,
        interacting: {
            nodeMovable(view) {
                const node = view.cell
                const { nodeMovable } = node.getData() || {}
                return nodeMovable
            },
        }
    })
    fileApi.getFiles().then(res => {
        files.value  = res;
        dealModuleRelative(files.value);
        console.log(data);
        let dagreLayout = new DagreLayout({
            type: 'dagre',
            rankdir: 'LR',
            align: 'UL',
            ranksep: 50,
            nodesep: 50,
            controlPoints: true,
        });
        graph.fromJSON(dagreLayout.layout(data)) // 渲染元素
        graph.on('node:mouseenter', args => {
            // console.log(args.node.getConnectedEdges());
            console.log(graph.getConnectedEdges(args.node));
            let edges = graph.getConnectedEdges(args.node);
            edges.forEach(edge => {
                edge.attr('line/stroke', 'blue'); // 设置连接线颜色为红色
            });
        });
        graph.on('node:mouseleave', args => {
            // console.log(args.node.getConnectedEdges());
            console.log(graph.getConnectedEdges(args.node));
            let edges = graph.getConnectedEdges(args.node);
            edges.forEach(edge => {
                edge.attr('line/stroke', '#8f8f8f'); // 设置连接线颜色为红色
            });
        });
        graph.on('edge:mouseenter', args => {
            console.log(args);
        });
        // graph.centerContent() // 居中显示
    })

    // graph.addNode({
    //     shape: 'custom-vue-node',
    //     x: 100,
    //     y: 60,
    // })
});
</script>
<template>
    <div id="container">
        <!-- <div id="container"></div> -->
        <!-- <TeleportContainer /> -->
    </div>
</template>

<style lang="less" scoped>
    .app-content {
        height: calc(100% - 50px);
    }
    #container {
        flex: 1;
        height: calc(100% - 50px);
        margin-right: 8px;
        margin-left: 8px;
        border-radius: 5px;

    }
</style>
@/config/request