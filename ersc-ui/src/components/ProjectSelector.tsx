import React from 'react';
import { useAppSelector, useAppDispatch } from '@/stores/hooks';
import { updateCurrentProject, selectCurrentProject } from '@/stores/projectSlice';
import type { Project } from '@/stores/types';

interface ProjectSelectorProps {
  projects: Project.Project[];
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ projects }) => {
  const currentProject = useAppSelector(selectCurrentProject);
  const dispatch = useAppDispatch();

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedProject = projects.find(p => p.id === selectedId);
    
    if (selectedProject) {
      dispatch(updateCurrentProject(selectedProject));
    }
  };

  return (
    <div>
      <label htmlFor="project-select">选择项目: </label>
      <select 
        id="project-select"
        value={currentProject?.id || ''}
        onChange={handleProjectChange}
      >
        <option value="" disabled>请选择一个项目</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>
            {project.id}
          </option>
        ))}
      </select>
      
      {currentProject && (
        <div style={{ marginTop: '10px' }}>
          <h3>当前项目: {currentProject.id}</h3>
          {/* 可以展示更多项目信息 */}
        </div>
      )}
    </div>
  );
};

export default ProjectSelector; 