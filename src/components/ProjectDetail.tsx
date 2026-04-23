import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteProject, useGetProject, useUpdateProject } from '../gql/hooks/projectHooks';
import { useGetTasksByProject } from '../gql/hooks/taskHooks';
import { ProjectStatus } from '../types/projectMgr';
import type { Project } from '../types/projectMgr';
import StatusChip from './StatusChip';
import TaskCard from './TaskCard';
import CreateTaskModal from './CreateTaskModal';

const inputCls =
  'tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-1.5 tw:text-sm tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-blue-400';

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

  if (isPending) return <div className="tw:p-6 tw:text-gray-500">Loading...</div>;
  if (isError || !project) return <div className="tw:p-6 tw:text-red-500">Project not found.</div>;

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
        className="tw:text-sm tw:text-blue-600 tw:hover:underline tw:mb-6 tw:inline-flex tw:items-center tw:gap-1"
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
          <h1 className="tw:text-2xl tw:font-bold tw:text-gray-900 tw:flex-1">{d.name}</h1>
        )}

        <div className="tw:flex tw:items-center tw:gap-2 tw:shrink-0">
          {editing ? (
            <>
              <button
                onClick={cancelEdit}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-gray-300 tw:rounded tw:hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={updateProject.isPending || !d.name}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:bg-blue-600 tw:text-white tw:rounded tw:hover:bg-blue-700 tw:disabled:opacity-50"
              >
                {updateProject.isPending ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : confirmDelete ? (
            <>
              <span className="tw:text-sm tw:text-gray-600">Delete?</span>
              <button
                onClick={handleDelete}
                disabled={deleteProject.isPending}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:bg-red-600 tw:text-white tw:rounded tw:hover:bg-red-700 tw:disabled:opacity-50"
              >
                {deleteProject.isPending ? 'Deleting...' : 'Yes'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-gray-300 tw:rounded tw:hover:bg-gray-50"
              >
                No
              </button>
            </>
          ) : (
            <>
              <button
                onClick={enterEdit}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-gray-300 tw:rounded tw:hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-red-300 tw:text-red-600 tw:rounded tw:hover:bg-red-50"
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
            <p className="tw:text-gray-700">{d.description}</p>
          )}
        </div>
      )}

      {/* Status + Due Date */}
      {(editing || d.status || d.dueDate) && (
        <div className="tw:flex tw:gap-6 tw:items-center tw:mb-8">
          {editing ? (
            <>
              <div className="tw:flex tw:flex-col tw:gap-1">
                <span className="tw:text-xs tw:text-gray-500">Status</span>
                <select
                  value={d.status ?? ''}
                  onChange={(e) =>
                    patch({ status: (e.target.value as ProjectStatus) || undefined })
                  }
                  className="tw:border tw:border-gray-300 tw:rounded tw:px-2 tw:py-1.5 tw:text-sm tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-blue-400"
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
                <span className="tw:text-xs tw:text-gray-500">Due Date</span>
                <input
                  type="date"
                  value={d.dueDate ?? ''}
                  onChange={(e) => patch({ dueDate: e.target.value || undefined })}
                  className="tw:border tw:border-gray-300 tw:rounded tw:px-2 tw:py-1.5 tw:text-sm tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-blue-400"
                />
              </div>
            </>
          ) : (
            <>
              {d.status && <StatusChip status={d.status} />}
              {d.dueDate && (
                <span className="tw:text-sm tw:text-gray-500">Due {d.dueDate}</span>
              )}
            </>
          )}
        </div>
      )}

      {updateProject.isError && (
        <p className="tw:text-red-500 tw:text-sm tw:mb-4">Failed to save changes.</p>
      )}

      {/* Tasks section */}
      <div className="tw:border-t tw:border-gray-100 tw:pt-6">
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
          <h2 className="tw:text-lg tw:font-semibold tw:text-gray-900">Tasks</h2>
          <button
            onClick={() => setShowTaskModal(true)}
            className="tw:px-3 tw:py-1.5 tw:text-sm tw:bg-blue-600 tw:text-white tw:rounded tw:hover:bg-blue-700"
          >
            New Task
          </button>
        </div>

        {tasksPending ? (
          <p className="tw:text-gray-400 tw:text-sm">Loading tasks...</p>
        ) : tasks?.length === 0 ? (
          <p className="tw:text-gray-400 tw:text-sm">No tasks yet.</p>
        ) : (
          <div className="tw:flex tw:flex-col tw:gap-3">
            {tasks?.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>

      {showTaskModal && (
        <CreateTaskModal projectId={id!} onClose={() => setShowTaskModal(false)} />
      )}
    </div>
  );
}
