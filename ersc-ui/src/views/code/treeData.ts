import { isDir } from '@/utils/file';
import type { TreeDataNode } from 'antd';

export function getTreeData(arr: Array<string>) {
    let treeData: Array<TreeDataNode> = [];
    let fileList: Array<Project.FileItem> = [];
    arr.forEach(item => {
        genPathWithTree('/', treeData, item.split('/').filter(item => item !== ''), fileList);
    });
    sortTreeData(treeData);
    return {
        treeData,
        fileList,
    };
}

function genPathWithTree(parentPath: string, treeData: Array<TreeDataNode>, pathArr: Array<string>, fileList: Array<Project.FileItem>) {
    let index = treeData.findIndex(item => item.title === pathArr[0]);
    if (index === -1 && pathArr.length) {
        let key = parentPath + pathArr[0] + (pathArr.length > 1 ? '/' : '');
        treeData.push({
            title: pathArr[0],
            key,
            children: [],
        });
        fileList.push({
            key,
            name: pathArr[0],
        });
        if (pathArr.length > 1) {
            genPathWithTree(treeData[treeData.length - 1].key as string, treeData[treeData.length - 1].children as Array<TreeDataNode>, pathArr.slice(1), fileList);
        }
    } else if (index !== -1) {
        let children = treeData[index].children;
        genPathWithTree(treeData[index].key as string, children as Array<TreeDataNode>, pathArr.slice(1), fileList);
    }
}

function sortTreeData(treeData: Array<TreeDataNode>) {
    treeData.sort((a, b) => {
        let aIsDir = isDir(a.key as string);
        let bIsDir = isDir(b.key as string);
        if (aIsDir && !bIsDir) {
            return -1;
        } else if (!aIsDir && bIsDir) {
            return 1;
        } else {
            let lowerA = (a.key as string).toLowerCase();
            let lowerB = (b.key as string).toLowerCase();
            let extA = lowerA.split('.').pop();
            let extB = lowerB.split('.').pop();
            if (extA && extB) {
                return extA.localeCompare(extB);
            } else {
                return lowerA.localeCompare(lowerB);
            }
        }
    });
    treeData.forEach(item => {
        if (item.children?.length) {
            sortTreeData(item.children as Array<TreeDataNode>);
        }
    });
}