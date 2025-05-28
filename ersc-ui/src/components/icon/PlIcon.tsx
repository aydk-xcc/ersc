import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

export default function PlIcon({type, style, className}: {type: string, style?: React.CSSProperties, className?: string}) {
    const IconFont = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/c/font_4511939_c9w6w120mkq.js',
    });
    return <IconFont type={type} style={style} className={className} />
}
