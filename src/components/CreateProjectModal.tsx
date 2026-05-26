import React, { useState } from 'react';
import { useCreateProject } from '../gql/hooks/projectHooks';
import { ProjectStatus } from '../types/projectMgr';

type Props = {
  onClose: () => void;
};

const inputCls =
  'tw:w-full tw:border tw:border-[#BC13FE] tw:rounded tw:px-3 tw:py-1.5 tw:text-sm tw:bg-[#0d0a14] tw:text-[#f0e6ff] tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[#BC13FE]';

const STATUS_OPTIONS = [
  { value: ProjectStatus.NOT_STARTED, label: 'Not Started' },
  { value: ProjectStatus.IN_PROGRESS, label: 'In Progress' },
  { value: ProjectStatus.COMPLETED, label: 'Completed' },
  { value: ProjectStatus.ON_HOLD, label: 'On Hold' },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-1">
      <label className="tw:text-sm tw:font-medium tw:text-[#c4b5fd]">{label}</label>
      {children}
    </div>
  );
}

export default function CreateProjectModal({ onClose }: Props) {
  const createProject = useCreateProject();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus | ''>('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProject.mutate(
      {
        name,
        description: description || undefined,
        status: status || undefined,
        dueDate: dueDate || undefined,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="tw:fixed tw:inset-0 tw:bg-[rgba(13,10,20,0.85)] tw:flex tw:items-center tw:justify-center tw:z-50">
      <div className="tw:bg-[#1a0f2e] tw:border tw:border-[#BC13FE] tw:rounded-lg tw:shadow-xl tw:w-full tw:max-w-lg tw:p-6">
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-5">
          <h2 className="tw:text-xl tw:font-semibold tw:text-[#f0e6ff]">New Project</h2>
          <button
            onClick={onClose}
            className="tw:text-[#c4b5fd] tw:hover:text-[#f0e6ff] tw:text-lg tw:leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="tw:flex tw:flex-col tw:gap-4">
          <Field label="Name *">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputCls}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={inputCls}
            />
          </Field>

          <div className="tw:grid tw:grid-cols-2 tw:gap-3">
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus | '')}
                className={inputCls}
              >
                <option value="">None</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Due Date">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputCls}
              />
            </Field>
          </div>

          {createProject.isError && (
            <p className="tw:text-[#e22c5a] tw:text-sm">Failed to create project.</p>
          )}

          <div className="tw:flex tw:justify-end tw:gap-3 tw:pt-2 tw:border-t tw:border-[rgba(188,19,254,0.2)]">
            <button
              type="button"
              onClick={onClose}
              className="tw:px-4 tw:py-2 tw:text-sm tw:border tw:border-[#c4b5fd] tw:text-[#c4b5fd] tw:rounded tw:hover:bg-[rgba(196,181,253,0.1)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createProject.isPending || !name}
              className="tw:px-4 tw:py-2 tw:text-sm tw:border tw:border-[#BC13FE] tw:text-[#BC13FE] tw:rounded tw:hover:bg-[#BC13FE] tw:hover:text-white tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
            >
              {createProject.isPending ? 'Saving...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
