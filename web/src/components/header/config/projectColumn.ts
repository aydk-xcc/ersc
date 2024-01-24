export default [
    {
        label: '项目名称',
        tooltips: true,
        prop: 'name'
    },
    {
        label: '入口文件',
        prop: 'entry'
    },
    {
        label: '根目录',
        prop: 'base_dir',
        width: 150
    },
    {
        label: '进度',
        slot: 'process',
        width: 100,
    },
    {
        label: '创建时间',
        prop: 'createdAt',
        width: 160,
        datetime: true
    },
    {
        label: '更新时间',
        prop: 'updatedAt',
        width: 160,
        datetime: true
    }
]