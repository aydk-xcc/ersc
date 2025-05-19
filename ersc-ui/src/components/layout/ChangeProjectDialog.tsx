import { useState, useEffect } from "react";
import { Modal, Select } from "antd";
import projectApi from '@/api/projectApi';

interface Project {
    id: string;
    name: string;
    version: string;
}

interface ChangeProjectDialogProps {
    visible: boolean;
    onClose: () => void;
    onSelect?: (project: Project) => void;
}

export default function ChangeProjectDialog({ visible, onClose, onSelect }: ChangeProjectDialogProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);

    useEffect(() => {
        if (visible) {
            setLoading(true);
            projectApi.getProjects()
                .then(res => {
                    setProjects(res.data.list || []);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [visible]);

    const handleOk = () => {
        if (currentProject) {
            onSelect?.(currentProject);
        }
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal
            title="选择项目"
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={600}
            confirmLoading={loading}
        >
            <Select
                style={{ width: '100%' }}
                loading={loading}
                placeholder="请选择项目"
                allowClear
                showSearch
                filterOption={(input, option) => {
                    if (!option) return false;
                    const label = option.label?.toString().toLowerCase() || '';
                    const value = option.value?.toString().toLowerCase() || '';
                    const searchText = input.toLowerCase();
                    return label.includes(searchText) || value.includes(searchText);
                }}
                options={projects.map(project => ({
                    label: `${project.name}(${project.version})`,
                    value: project.id
                }))}
                onChange={value => {
                    if (!value) {
                        setCurrentProject(null);
                        return;
                    }
                    const selected = projects.find(p => p.id === value);
                    if (selected) {
                        setCurrentProject(selected);
                    }
                }}
            />
        </Modal>
    );
}