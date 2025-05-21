import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

export default function PlIcon({type, style}: {type: string, style?: React.CSSProperties}) {
    const IconFont = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/c/font_4511939_8u7gjls54wn.js',
    });
    return <IconFont type={type} style={style} />
}
