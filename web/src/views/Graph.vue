<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import ProgressNode from './graph-view/ProgressNode.vue'
import { Graph } from '@antv/x6';
import { DagreLayout } from '@antv/layout';
import {BASE_HOST} from '../api/serviceConfig';
import request from '../api/request';
import path from '../utils/path';
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
    obj.arr.forEach((file, index) => {
        data.nodes.push({
            id: (obj.basedir + file.path + file.name).replace(/\/\//g, '/'),
            shape: 'rect',
            x: 40*index,
            y: 40*index,
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
        let current = (obj.basedir + file.path + file.name).replace(/\/\//g, '/')
        console.log(current);
        file.str.body.forEach(node => {
            if (node.type === "ImportDeclaration" && node.source.value.includes('/')) {
                console.log(node.source.value, path.resolve(current, node.source.value));
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
        })
    });
}

function checkSourceFile(fileList) {

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
    fetch(BASE_HOST + '/files').then(async res => {
        files.value  = await res.json();
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
