import React, { useState } from 'react';
import { useDeleteTask, useUpdateTask } from '../gql/hooks/taskHooks';
import { TaskStatus } from '../types/projectMgr';
import StatusChip from './StatusChip';
import type { Task } from '../types/projectMgr';

type Props = {
  task: Task;
};

const inputCls =
  'tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-1.5 tw:text-sm tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-blue-400';

const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
];

export default function TaskCard({ task }: Props) {
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Task>(task);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const enterEdit = () => {
    setDraft({ ...task });
    setEditing(true);
    setConfirmDelete(false);
  };

  const cancelEdit = () => {
    setDraft(task);
    setEditing(false);
  };

  const save = () => {
    updateTask.mutate(draft, {
      onSuccess: () => setEditing(false),
    });
  };

  const handleDelete = () => {
    deleteTask.mutate({ id: task.id, projectId: task.projectId });
  };

  const patch = (fields: Partial<Task>) => setDraft((prev) => ({ ...prev, ...fields }));

  return (
    <div className="tw:border tw:border-gray-200 tw:rounded-lg tw:p-4">
      {editing ? (
        <div className="tw:flex tw:flex-col tw:gap-3">
          <input
            value={draft.name}
            onChange={(e) => patch({ name: e.target.value })}
            className={inputCls}
          />
          <textarea
            value={draft.description ?? ''}
            onChange={(e) => patch({ description: e.target.value || undefined })}
            rows={2}
            placeholder="Description"
            className={inputCls}
          />
          <div className="tw:grid tw:grid-cols-2 tw:gap-3">
            <select
              value={draft.status ?? ''}
              onChange={(e) =>
                patch({ status: (e.target.value as TaskStatus) || undefined })
              }
              className={inputCls}
            >
              <option value="">No status</option>
              {TASK_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={draft.dueDate ?? ''}
              onChange={(e) => patch({ dueDate: e.target.value || undefined })}
              className={inputCls}
            />
          </div>
          {updateTask.isError && (
            <p className="tw:text-red-500 tw:text-xs">Failed to save changes.</p>
          )}
          <div className="tw:flex tw:gap-2 tw:justify-end">
            <button
              onClick={cancelEdit}
              className="tw:px-3 tw:py-1.5 tw:text-sm tw:border tw:border-gray-300 tw:rounded tw:hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={updateTask.isPending || !draft.name}
              className="tw:px-3 tw:py-1.5 tw:text-sm tw:bg-blue-600 tw:text-white tw:rounded tw:hover:bg-blue-700 tw:disabled:opacity-50"
            >
              {updateTask.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <div className="tw:flex tw:items-start tw:gap-4">
          <div className="tw:flex-1 tw:min-w-0">
            <p className="tw:font-medium tw:text-gray-900">{task.name}</p>
            {task.description && (
              <p className="tw:text-sm tw:text-gray-500 tw:mt-0.5">{task.description}</p>
            )}
          </div>
          <div className="tw:flex tw:items-center tw:gap-2 tw:shrink-0">
            {task.status && <StatusChip status={task.status} />}
            {task.dueDate && (
              <span className="tw:text-xs tw:text-gray-400">Due {task.dueDate}</span>
            )}
            {confirmDelete ? (
              <>
                <span className="tw:text-sm tw:text-gray-600">Delete?</span>
                <button
                  onClick={handleDelete}
                  disabled={deleteTask.isPending}
                  className="tw:px-2.5 tw:py-1 tw:text-xs tw:bg-red-600 tw:text-white tw:rounded tw:hover:bg-red-700 tw:disabled:opacity-50"
                >
                  {deleteTask.isPending ? '...' : 'Yes'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="tw:px-2.5 tw:py-1 tw:text-xs tw:border tw:border-gray-300 tw:rounded tw:hover:bg-gray-50"
                >
                  No
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={enterEdit}
                  className="tw:px-2.5 tw:py-1 tw:text-xs tw:border tw:border-gray-300 tw:rounded tw:hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="tw:px-2.5 tw:py-1 tw:text-xs tw:border tw:border-red-300 tw:text-red-600 tw:rounded tw:hover:bg-red-50"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
