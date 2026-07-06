import { Button, GhostButton } from '@bka-stuff/pe-mfe-utils';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteProject } from '../../gql/hooks/projectHooks';
import { Project } from '../../types/projectMgr';
import StatusChip from '../StatusChip';

type Props = {
  enterEdit: () => void;
  project: Project;
};

const ProjectDetailView: FC<Props> = ({ enterEdit, project }) => {
  const navigate = useNavigate();
  const deleteProject = useDeleteProject();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    deleteProject.mutate(project.id, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <>
      <div className="tw:flex tw:items-start tw:gap-4 tw:mb-6">
        <h1 className="tw:text-2xl tw:font-bold tw:text-primary tw:flex-1">{project.name}</h1>

        <div className="tw:flex tw:items-center tw:gap-2 tw:shrink-0">
          {confirmDelete ? (
            <>
              <span className="tw:text-sm tw:text-[#c4b5fd]">Delete?</span>
              <Button
                onClick={handleDelete}
                text={deleteProject.isPending ? 'Deleting...' : 'Yes'}
                color="red"
                disabled={deleteProject.isPending}
                last
              />
              <Button onClick={() => setConfirmDelete(false)} text="No" color="blue" last />
            </>
          ) : (
            <>
              <GhostButton onClick={enterEdit} text="Edit" color="blue" last />
              <Button onClick={() => setConfirmDelete(true)} text="Delete" color="red" last />
            </>
          )}
        </div>
      </div>

      <div className="tw:mb-6">
        <p className="tw:text-[#f0e6ff]">{project.description}</p>
      </div>

      {project.status || project.dueDate ? (
        <div className="tw:flex tw:gap-6 tw:items-center tw:mb-8">
          {project.status && <StatusChip status={project.status} />}
          {project.dueDate && (
            <span className="tw:text-sm tw:text-[#c4b5fd]">Due {project.dueDate}</span>
          )}
        </div>
      ) : null}
    </>
  );
};

export default ProjectDetailView;
