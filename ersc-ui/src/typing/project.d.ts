declare namespace Project {
    interface ProjectInfo {
        name: string;
        version: string;
        types: string[];
        currentType: string;
    }

    interface TreeNodeData {
        name: string;
        label: string;
        type: string;
        path: string;
        ext: string;
        children: TreeNodeData[];
    }
}