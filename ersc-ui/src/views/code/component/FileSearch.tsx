import { Input } from 'antd';
import { useState, useEffect } from 'react';
import './FileSearch.scss';
import PlIcon from '@/components/icon/PlIcon';
import { getFileIcon, isDir } from '@/utils/file';

export default function FileSearch({fileList}: {fileList: Array<Project.FileItem>}) {
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState<Array<Project.FileItem>>([]);

    useEffect(() => {
        if (searchValue) {
            setSearchResult(fileList.filter(item => {
                let lowerCaseName = item.key.toLowerCase();
                if (lowerCaseName.includes(searchValue.toLowerCase())) {
                    return true;
                }
                return false;
            }));
        } else {
            setSearchResult([]);
        }
    }, [searchValue]);

    return (
        <div className="file-search">
            <Input 
                placeholder="Search" 
                onChange={e => setSearchValue(e.target.value)} 
            />
            <div className="file-search-list">
                {searchResult.filter(item => item.name.includes(searchValue)).map(item => (
                    <div
                        key={item.key}
                        className="file-search-item"
                    >
                        <PlIcon
                            type={isDir(item.key) ? 'vs-folder' : getFileIcon(item.key as string)}
                            className="file-search-item-icon"
                        />
                        {item.key}
                    </div>
                ))}
            </div>
        </div>
    );
}