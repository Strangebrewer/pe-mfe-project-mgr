import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGetProjects } from './gql/hooks/projectHooks';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/project-detail/ProjectDetail';
import CreateProjectModal from './components/CreateProjectModal';
import { ProjectStatus } from './types/projectMgr';
import { Button } from '@bka-stuff/pe-mfe-utils';
import './index.css';

const STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.NOT_STARTED]: 'Not Started',
  [ProjectStatus.IN_PROGRESS]: 'In Progress',
  [ProjectStatus.COMPLETED]: 'Completed',
  [ProjectStatus.ON_HOLD]: 'On Hold',
};

function ProjectList() {
  const { data: projects, isPending, isError } = useGetProjects();
  const [showModal, setShowModal] = useState(false);
  const [activeStatus, setActiveStatus] = useState<ProjectStatus | null>(null);

  if (isPending) return <div className="tw:p-6 tw:text-[#c4b5fd]">Loading...</div>;
  if (isError) return <div className="tw:p-6 tw:text-[#e22c5a]">Failed to load projects.</div>;

  const filtered = activeStatus ? projects?.filter((p) => p.status === activeStatus) : projects;

  return (
    <div className="tw:max-w-2xl tw:mx-auto tw:p-6">
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
        <h1 className="tw:text-2xl tw:font-bold tw:text-[#f0e6ff]">Projects</h1>
        <Button last color="purple" text="New Project" onClick={() => setShowModal(true)} />
      </div>

      <div className="tw:flex tw:gap-2 tw:flex-wrap tw:mb-4">
        <button
          onClick={() => setActiveStatus(null)}
          className={`tw:text-xs tw:rounded-full tw:px-3 tw:py-1 tw:border tw:transition-colors ${
            !activeStatus
              ? 'tw:bg-[#BC13FE] tw:text-white tw:border-[#BC13FE]'
              : 'tw:bg-transparent tw:text-[#c4b5fd] tw:border-[#BC13FE] tw:hover:text-[#f0e6ff]'
          }`}
        >
          All
        </button>
        {Object.values(ProjectStatus).map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(activeStatus === s ? null : s)}
            className={`tw:text-xs tw:rounded-full tw:px-3 tw:py-1 tw:border tw:transition-colors ${
              activeStatus === s
                ? 'tw:bg-[#BC13FE] tw:text-white tw:border-[#BC13FE]'
                : 'tw:bg-transparent tw:text-[#c4b5fd] tw:border-[#BC13FE] tw:hover:text-[#f0e6ff]'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {filtered?.length === 0 && (
        <p className="tw:text-[#c4b5fd] tw:text-sm">
          {activeStatus
            ? `No projects with status "${STATUS_LABELS[activeStatus]}".`
            : 'No projects yet. Create one!'}
        </p>
      )}

      <div className="tw:flex tw:flex-col tw:gap-3">
        {filtered?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <CreateProjectModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ProjectList />} />
      <Route path=":id" element={<ProjectDetail />} />
      <Route path="*" element={<div className="tw:p-6">Not found.</div>} />
    </Routes>
  );
};

export default App;
