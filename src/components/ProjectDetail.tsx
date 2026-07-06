import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteProject, useGetProject, useUpdateProject } from '../gql/hooks/projectHooks';
import { useGetTasksByProject } from '../gql/hooks/taskHooks';
import { ProjectStatus } from '../types/projectMgr';
import type { Project } from '../types/projectMgr';
import { Button } from '@bka-stuff/pe-mfe-utils';
import StatusChip from './StatusChip';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';

const inputCls =
  'tw:w-full tw:border tw:border-[#BC13FE] tw:rounded tw:px-3 tw:py-1.5 tw:text-sm tw:bg-[#0d0a14] tw:text-[#f0e6ff] tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[#BC13FE]';

const inlineCls =
  'tw:border tw:border-[#BC13FE] tw:rounded tw:px-2 tw:py-1.5 tw:text-sm tw:bg-[#0d0a14] tw:text-[#f0e6ff] tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[#BC13FE]';

const PROJECT_STATUS_OPTIONS = [
  { value: ProjectStatus.NOT_STARTED, label: 'Not Started' },
  { value: ProjectStatus.IN_PROGRESS, label: 'In Progress' },
  { value: ProjectStatus.COMPLETED, label: 'Completed' },
  { value: ProjectStatus.ON_HOLD, label: 'On Hold' },
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isPending, isError } = useGetProject(id!);
  const { data: tasks, isPending: tasksPending } = useGetTasksByProject(id!);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Project | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  if (isPending) return <div className="tw:p-6 tw:text-[#c4b5fd]">Loading...</div>;
  if (isError || !project)
    return <div className="tw:p-6 tw:text-[#e22c5a]">Project not found.</div>;

  const enterEdit = () => {
    setDraft({ ...project });
    setEditing(true);
    setConfirmDelete(false);
  };

  const cancelEdit = () => {
    setDraft(null);
    setEditing(false);
  };

  const save = () => {
    if (!draft) return;
    updateProject.mutate(draft, {
      onSuccess: () => {
        setEditing(false);
        setDraft(null);
      },
    });
  };

  const handleDelete = () => {
    deleteProject.mutate(project.id, {
      onSuccess: () => navigate('/'),
    });
  };

  const patch = (fields: Partial<Project>) => setDraft((prev) => ({ ...prev!, ...fields }));

  const d = editing ? draft! : project;

  return (
    <div className="tw:max-w-2xl tw:mx-auto tw:px-6 tw:pt-6 tw:pb-16">
      <button
        onClick={() => navigate('/projects')}
        className="tw:text-sm tw:text-[#00E5FF] tw:hover:underline tw:mb-6 tw:inline-flex tw:items-center tw:gap-1"
      >
        ← Back
      </button>

      {/* Header: name + actions */}
      <div className="tw:flex tw:items-start tw:gap-4 tw:mb-6">
        {editing ? (
          <input
            value={d.name}
            onChange={(e) => patch({ name: e.target.value })}
            className={`${inputCls} tw:text-xl tw:font-bold tw:flex-1`}
          />
        ) : (
          <h1 className="tw:text-2xl tw:font-bold tw:text-[#f0e6ff] tw:flex-1">{d.name}</h1>
        )}

        <div className="tw:flex tw:items-center tw:gap-2 tw:shrink-0">
          {editing ? (
            <>
              <button
                onClick={cancelEdit}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-[#c4b5fd] tw:text-[#c4b5fd] tw:rounded tw:hover:bg-[rgba(196,181,253,0.1)]"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={updateProject.isPending || !d.name}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-[#BC13FE] tw:text-[#BC13FE] tw:rounded tw:hover:bg-[#BC13FE] tw:hover:text-white tw:disabled:opacity-50"
              >
                {updateProject.isPending ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : confirmDelete ? (
            <>
              <span className="tw:text-sm tw:text-[#c4b5fd]">Delete?</span>
              <button
                onClick={handleDelete}
                disabled={deleteProject.isPending}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:bg-[#e22c5a] tw:text-white tw:rounded tw:hover:bg-[#c01848] tw:disabled:opacity-50"
              >
                {deleteProject.isPending ? 'Deleting...' : 'Yes'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-[#c4b5fd] tw:text-[#c4b5fd] tw:rounded tw:hover:bg-[rgba(196,181,253,0.1)]"
              >
                No
              </button>
            </>
          ) : (
            <>
              <button
                onClick={enterEdit}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-[#c4b5fd] tw:text-[#c4b5fd] tw:rounded tw:hover:bg-[rgba(196,181,253,0.1)]"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-[#e22c5a] tw:text-[#e22c5a] tw:rounded tw:hover:bg-[rgba(226,44,90,0.1)]"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {(editing || d.description) && (
        <div className="tw:mb-6">
          {editing ? (
            <textarea
              value={d.description ?? ''}
              onChange={(e) => patch({ description: e.target.value || undefined })}
              rows={2}
              placeholder="Description"
              className={inputCls}
            />
          ) : (
            <p className="tw:text-[#f0e6ff]">{d.description}</p>
          )}
        </div>
      )}

      {/* Status + Due Date */}
      {(editing || d.status || d.dueDate) && (
        <div className="tw:flex tw:gap-6 tw:items-center tw:mb-8">
          {editing ? (
            <>
              <div className="tw:flex tw:flex-col tw:gap-1">
                <span className="tw:text-xs tw:text-[#c4b5fd]">Status</span>
                <select
                  value={d.status ?? ''}
                  onChange={(e) =>
                    patch({ status: (e.target.value as ProjectStatus) || undefined })
                  }
                  className={inlineCls}
                >
                  <option value="">None</option>
                  {PROJECT_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="tw:flex tw:flex-col tw:gap-1">
                <span className="tw:text-xs tw:text-[#c4b5fd]">Due Date</span>
                <input
                  type="date"
                  value={d.dueDate ?? ''}
                  onChange={(e) => patch({ dueDate: e.target.value || undefined })}
                  className={inlineCls}
                />
              </div>
            </>
          ) : (
            <>
              {d.status && <StatusChip status={d.status} />}
              {d.dueDate && <span className="tw:text-sm tw:text-[#c4b5fd]">Due {d.dueDate}</span>}
            </>
          )}
        </div>
      )}

      {updateProject.isError && (
        <p className="tw:text-[#e22c5a] tw:text-sm tw:mb-4">Failed to save changes.</p>
      )}

      {/* Tasks section */}
      <div className="tw:border-t tw:border-[rgba(188,19,254,0.2)] tw:pt-6">
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
          <h2 className="tw:text-lg tw:font-semibold tw:text-[#f0e6ff]">Tasks</h2>
          <Button last color="purple" text="New Task" onClick={() => setShowTaskModal(true)} />
        </div>

        {tasksPending ? (
          <p className="tw:text-[#c4b5fd] tw:text-sm">Loading tasks...</p>
        ) : tasks?.length === 0 ? (
          <p className="tw:text-[#c4b5fd] tw:text-sm">No tasks yet.</p>
        ) : (
          <div className="tw:flex tw:flex-col tw:gap-3">
            {tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {showTaskModal && <CreateTaskModal projectId={id!} onClose={() => setShowTaskModal(false)} />}
    </div>
  );
}
