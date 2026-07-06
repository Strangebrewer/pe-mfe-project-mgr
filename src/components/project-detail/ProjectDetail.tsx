import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Project } from '../../types/projectMgr';
import { useGetProject } from '../../gql/hooks/projectHooks';
import ProjectDetailEdit from './ProjectDetailEdit';
import ProjectDetailView from './ProjectDetailView';
import TaskList from '../TaskList';

const ProjectDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isPending, isError } = useGetProject(id!);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Project | null>(null);

  if (isPending) return <div className="tw:p-6 tw:text-[#c4b5fd]">Loading...</div>;
  if (isError || !project)
    return <div className="tw:p-6 tw:text-[#e22c5a]">Project not found.</div>;

  const patch = (fields: Partial<Project>) => setDraft((prev) => ({ ...prev!, ...fields }));

  const exitEdit = () => {
    setDraft(null);
    setEditing(false);
  };

  const enterEdit = () => {
    setDraft({ ...project });
    setEditing(true);
  };

  return (
    <div className="tw:max-w-2xl tw:mx-auto tw:px-6 tw:pt-6 tw:pb-16">
      <button
        onClick={() => navigate('/projects')}
        className="tw:text-sm tw:text-blue tw:hover:underline tw:mb-6 tw:inline-flex tw:items-center tw:gap-1"
      >
        ← Back
      </button>

      {editing ? (
        <ProjectDetailEdit draft={draft} exitEdit={exitEdit} patch={patch} />
      ) : (
        <ProjectDetailView enterEdit={enterEdit} project={project} />
      )}

      <TaskList id={id} />
    </div>
  );
};

export default ProjectDetail;
