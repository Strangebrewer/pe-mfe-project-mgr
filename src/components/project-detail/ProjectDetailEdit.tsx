import { FC } from 'react';
import { Button, GhostButton, Input, Select, Textarea } from '@bka-stuff/pe-mfe-utils';
import { Project, ProjectStatus } from '../../types/projectMgr';
import { useUpdateProject } from '../../gql/hooks/projectHooks';

const PROJECT_STATUS_OPTIONS = [
  { value: ProjectStatus.NOT_STARTED, label: 'Not Started' },
  { value: ProjectStatus.IN_PROGRESS, label: 'In Progress' },
  { value: ProjectStatus.COMPLETED, label: 'Completed' },
  { value: ProjectStatus.ON_HOLD, label: 'On Hold' },
];

type Props = {
  draft: Project | null;
  exitEdit: () => void;
  patch: (fields: Partial<Project>) => void;
};

const ProjectDetailEdit: FC<Props> = ({ draft, exitEdit, patch }) => {
  const updateProject = useUpdateProject();

  const save = () => {
    if (!draft) return;
    updateProject.mutate(draft, {
      onSuccess: () => {
        exitEdit();
      },
    });
  };

  return (
    <>
      <div className="tw:flex tw:items-start tw:gap-4 tw:mb-6">
        <div className="tw:w-full">
          <Input value={draft?.name} onChange={(e) => patch({ name: e.target.value })} full />
        </div>

        <div className="tw:flex tw:items-center tw:gap-2 tw:shrink-0">
          <GhostButton onClick={exitEdit} color="red" text="Cancel" last />
          <Button
            onClick={save}
            text={updateProject.isPending ? 'Saving...' : 'Save'}
            disabled={updateProject.isPending || !draft?.name}
            color="purple"
            last
          />
        </div>
      </div>

      <div className="tw:mb-6">
        <Textarea
          value={draft?.description ?? ''}
          onChange={(e) => patch({ description: e.target.value || undefined })}
          rows={2}
          placeholder="Description"
          full
        />
      </div>

      <div className="tw:flex tw:gap-6 tw:items-center tw:mb-8">
        <div className="tw:flex tw:flex-col tw:gap-1">
          <span className="tw:text-xs tw:text-[#c4b5fd]">Status</span>
          <Select
            value={draft?.status ?? ''}
            onChange={(e) => patch({ status: (e.target.value as ProjectStatus) || undefined })}
          >
            <option value="">None</option>
            {PROJECT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="tw:flex tw:flex-col tw:gap-1">
          <span className="tw:text-xs tw:text-[#c4b5fd]">Due Date</span>
          <Input
            type="date"
            value={draft?.dueDate ?? ''}
            onChange={(e) => patch({ dueDate: e.target.value || undefined })}
          />
        </div>
      </div>

      {updateProject.isError && (
        <p className="tw:text-[#e22c5a] tw:text-sm tw:mb-4">Failed to save changes.</p>
      )}
    </>
  );
};

export default ProjectDetailEdit;
