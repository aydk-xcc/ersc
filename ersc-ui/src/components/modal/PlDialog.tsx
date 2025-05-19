import { Modal } from 'antd';
import type { ModalProps } from 'antd';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface DialogProps extends Omit<ModalProps, 'open'> {
    children?: ReactNode;
    onOk?: () => Promise<void> | void;
    onCancel?: () => void;
}

export default function PlDialog({
    children,
    onOk,
    onCancel,
    title,
    width = 520,
    ...restProps
}: DialogProps) {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const show = () => setVisible(true);
    const hide = () => setVisible(false);

    const handleOk = async () => {
        if (onOk) {
            try {
                setLoading(true);
                await onOk();
                hide();
            } catch (error) {
                console.error('Dialog onOk error:', error);
            } finally {
                setLoading(false);
            }
        } else {
            hide();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        hide();
    };

    return (
        <Modal
            title={title}
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={width}
            confirmLoading={loading}
            {...restProps}
        >
            {children}
        </Modal>
    );
}