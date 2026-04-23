import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGetProjects } from './gql/hooks/projectHooks';
import ProjectCard from './components/ProjectCard';
import ProjectDetail from './components/ProjectDetail';
import CreateProjectModal from './components/CreateProjectModal';
import { ProjectStatus } from './types/projectMgr';
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

  if (isPending) return <div className="tw:p-6 tw:text-gray-500">Loading...</div>;
  if (isError) return <div className="tw:p-6 tw:text-red-500">Failed to load projects.</div>;

  const filtered = activeStatus
    ? projects?.filter((p) => p.status === activeStatus)
    : projects;

  return (
    <div className="tw:max-w-2xl tw:mx-auto tw:p-6">
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
        <h1 className="tw:text-2xl tw:font-bold tw:text-gray-900">Projects</h1>
        <button
          onClick={() => setShowModal(true)}
          className="tw:px-4 tw:py-2 tw:text-sm tw:bg-blue-600 tw:text-white tw:rounded tw:hover:bg-blue-700"
        >
          New Project
        </button>
      </div>

      <div className="tw:flex tw:gap-2 tw:flex-wrap tw:mb-4">
        <button
          onClick={() => setActiveStatus(null)}
          className={`tw:text-xs tw:rounded-full tw:px-3 tw:py-1 tw:border tw:transition-colors ${
            !activeStatus
              ? 'tw:bg-blue-600 tw:text-white tw:border-blue-600'
              : 'tw:bg-white tw:text-gray-600 tw:border-gray-300 tw:hover:border-blue-400'
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
                ? 'tw:bg-blue-600 tw:text-white tw:border-blue-600'
                : 'tw:bg-white tw:text-gray-600 tw:border-gray-300 tw:hover:border-blue-400'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {filtered?.length === 0 && (
        <p className="tw:text-gray-500 tw:text-sm">
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

      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} />}
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
