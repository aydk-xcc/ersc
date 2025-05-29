import { Input, Tooltip } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import './FileSearch.scss';
import PlIcon from '@/components/icon/PlIcon';
import { getFileIcon, isDir } from '@/utils/file';
import { debounce } from 'lodash-es';

export default function FileSearch({fileList, choseFile}: {fileList: Array<Project.FileItem>, choseFile: (file: Project.FileItem) => void}) {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState<Array<Project.FileItem>>([]);
    const [caseSensitive, setCaseSensitive] = useState(false);
    const debouncedSearch = useCallback(
        debounce((value: string) => setSearchValue(value), 300),
        []
    );
    useEffect(() => {
        if (searchValue) {
            setSearchResult(
                fileList.filter(item => {
                    let lowerCaseName = item.key.toLowerCase();
                    if (caseSensitive) {
                        return item.key.includes(searchValue);
                    } else {
                        return lowerCaseName.includes(searchValue.toLowerCase());
                    }
                }).slice(0, 25)
            );
        } else {
            setSearchResult([]);
        }
    }, [searchValue, caseSensitive]);

    return (
        <div className="file-search">
            <Input 
                placeholder="输入查询的文件名" 
                allowClear
                addonAfter={
                    <PlIcon title="大小写敏感" type="vs-case" style={{
                        cursor: 'pointer',
                        color: caseSensitive ? '#1890ff' : '#000'
                    }} onClick={() => setCaseSensitive(!caseSensitive)} />
                }
                onChange={e => debouncedSearch(e.target.value)} 
            />
            <div className="file-search-list">
                {searchResult.map(item => (
                    <div
                        key={item.key}
                        className="file-search-item"
                        onClick={() => choseFile(item)}
                    >
                        <PlIcon
                            type={isDir(item.key) ? 'vs-folder' : getFileIcon(item.key as string)}
                            className="file-search-item-icon"
                        />
                        <Tooltip title={item.key} arrow={false} styles={{body: {width: '600px'}}}>
                            <div className="file-search-item-name">{item.key}</div>
                        </Tooltip>
                        <div className="file-search-item-go">打开</div>
                    </div>
                ))}
            </div>
        </div>
    );
}