import { useState, useEffect } from "react";
import { Modal, Select, Form } from "antd";
import projectApi from '@/api/projectApi';
import { useAppSelector, useAppDispatch } from '@/stores/hooks';
import { updateCurrentProject, selectCurrentProject } from '@/stores/projectSlice';

interface Project {
    name: string;
    version?: string;
    types?: string[];
    currentType?: string;
}

interface ChangeProjectDialogProps {
    visible: boolean;
    onClose: () => void;
    onSelect?: (project: Project) => void;
}

export default function ChangeProjectDialog({ visible, onClose, onSelect }: ChangeProjectDialogProps) {
    const [form] = Form.useForm();
    const [projects, setProjects] = useState<Project[]>([]);
    const [versions, setVersions] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const currentProjectSlice = useAppSelector(selectCurrentProject);
    const [currentProject, setCurrentProject] = useState<Project | null>(() => {
        if (currentProjectSlice) {
            return currentProjectSlice;
        }
        return null;
    });
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (currentProject) {
            form.setFieldsValue({
                project: currentProject.name,
                version: currentProject.version,
                type: currentProject.currentType
            });
        } else {
            form.resetFields();
        }
    }, [currentProject, form]);

    useEffect(() => {
        if (visible && currentProjectSlice) {
            setCurrentProject(currentProjectSlice);
        }
    }, [visible, currentProjectSlice]);

    useEffect(() => {
        if (visible) {
            setLoading(true);
            projectApi.getProjects()
                .then(res => {
                    setProjects(res.data.map((item: Project) => {
                        return {
                            name: item.name,
                            version: '',
                        }
                    }));
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [visible]);

    useEffect(() => {
        if (currentProject?.name) {
            projectApi.getProjectVersions(currentProject.name)
                .then(res => {
                    setVersions(res.data);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [currentProject?.name]);

    const handleOk = () => {
        if (currentProject && currentProject.name && currentProject.version && currentProject.currentType) {
            const projectInfo = {
                name: currentProject.name,
                version: currentProject.version,
                currentType: currentProject.currentType,
                types: currentProject.types || []
            };
            onSelect?.(currentProject);
            dispatch(updateCurrentProject(projectInfo));
        }
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    function changeProject(project: string) {
        if (!project) {
            setCurrentProject(null);
            return;
        }
        const selected = projects.find(p => p.name === project);
        if (selected) {
            setCurrentProject({
                name: selected.name,
                version: '',
                types: [],
                currentType: ''
            });
        }
    }

    return (
        <Modal
            title="选择代码库"
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={600}
            confirmLoading={loading}
        >
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                autoComplete="off"
            >
                <Form.Item
                    label="代码库"
                    name="project"
                    rules={[{ required: true, message: '请选择代码库' }]}
                >
                    <Select
                        style={{ width: '100%' }}
                        loading={loading}
                        placeholder="请选择代码库"
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
                            label: `${project.name}`,
                            value: project.name
                        }))}
                        onChange={changeProject}
                    />
                </Form.Item>

                <Form.Item
                    label="版本"
                    name="version"
                    rules={[{ required: true, message: '请选择版本' }]}
                >
                    <Select
                        style={{ width: '100%' }}
                        loading={loading}
                        placeholder="请选择版本"
                        allowClear
                        showSearch
                        filterOption={(input, option) => {
                            if (!option) return false;
                            const label = option.label?.toString().toLowerCase() || '';
                            const value = option.value?.toString().toLowerCase() || '';
                            const searchText = input.toLowerCase();
                            return label.includes(searchText) || value.includes(searchText);
                        }}
                        options={versions.map((item: Project) => ({
                            label: `${item.version}`,
                            value: item.version
                        }))}
                        onChange={value => {
                            if (!value) {
                                setCurrentProject({
                                    name: currentProject?.name || '',
                                    version: '',
                                    types: [],
                                    currentType: ''
                                });
                                return;
                            }
                            let versionInfo = versions.find(v => v.version === value);
                            setCurrentProject({
                                name: currentProject?.name || '',
                                version: value,
                                types: versionInfo?.types || [],
                                currentType: versionInfo?.types?.[0] || ''
                            });
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="类型"
                    name="type"
                    rules={[{ required: true, message: '请选择类型' }]}
                >
                    <Select
                        style={{ width: '100%' }}
                        loading={loading}
                        placeholder="请选择类型"
                        allowClear
                        showSearch
                        filterOption={(input, option) => {
                            if (!option) return false;
                            const label = option.label?.toString().toLowerCase() || '';
                            const value = option.value?.toString().toLowerCase() || '';
                            const searchText = input.toLowerCase();
                            return label.includes(searchText) || value.includes(searchText);
                        }}
                        options={(currentProject?.types || []).map(type => ({
                            label: type,
                            value: type
                        }))}
                        onChange={value => {
                            setCurrentProject({
                                ...currentProject,
                                name: currentProject?.name || '',
                                version: currentProject?.version || '',
                                types: currentProject?.types || [],
                                currentType: value || ''
                            });
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}