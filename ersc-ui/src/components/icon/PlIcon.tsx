import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import { Tooltip } from 'antd';

export default function PlIcon({type, title, style, className, onClick}: {type: string, title?: string, style?: React.CSSProperties, className?: string, onClick?: () => void}) {
    const IconFont = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/c/font_4511939_hcmhkbwm7h8.js',
    });
    return (
        <Tooltip placement="topLeft" title={title} arrow={false}>
            <IconFont 
                type={type} 
                style={style} 
                className={className} 
                onClick={onClick} 
            />
        </Tooltip>
    );
}
