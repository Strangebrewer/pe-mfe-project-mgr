import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../types/projectMgr';
import StatusChip from './StatusChip';

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(project.id)}
      className="tw:bg-surface tw:border tw:border-purpleBorder tw:rounded-lg tw:p-4 tw:cursor-pointer tw:hover:border-purple tw:hover:bg-purpleFaint tw:hover:shadow-[0_0_10px] tw:hover:shadow-blueBorder tw:transition-all"
    >
      <div className="tw:flex tw:items-start tw:justify-between tw:gap-4">
        <div className="tw:flex-1 tw:min-w-0">
          <h3 className="tw:font-medium tw:text-[#f0e6ff]">{project.name}</h3>
          {project.description && (
            <p className="tw:text-sm tw:text-[#c4b5fd] tw:mt-0.5 tw:line-clamp-2">
              {project.description}
            </p>
          )}
        </div>
        <div className="tw:flex tw:flex-col tw:items-end tw:gap-1.5 tw:shrink-0">
          {project.status && <StatusChip status={project.status} />}
          {project.dueDate && (
            <span className="tw:text-xs tw:text-[#c4b5fd]">Due {project.dueDate}</span>
          )}
        </div>
      </div>
    </div>
  );
}
