import React, { useState } from 'react';
import { useCreateTask } from '../gql/hooks/taskHooks';
import { TaskStatus } from '../types/projectMgr';

type Props = {
  projectId: string;
  onClose: () => void;
};

const inputCls =
  'tw:w-full tw:border tw:border-gray-300 tw:rounded tw:px-3 tw:py-1.5 tw:text-sm tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-blue-400';

const STATUS_OPTIONS = [
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="tw:flex tw:flex-col tw:gap-1">
      <label className="tw:text-sm tw:font-medium tw:text-gray-700">{label}</label>
      {children}
    </div>
  );
}

export default function CreateTaskModal({ projectId, onClose }: Props) {
  const createTask = useCreateTask();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTask.mutate(
      {
        projectId,
        name,
        description: description || undefined,
        status: status || undefined,
        dueDate: dueDate || undefined,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="tw:fixed tw:inset-0 tw:bg-black/50 tw:flex tw:items-center tw:justify-center tw:z-50">
      <div className="tw:bg-white tw:rounded-lg tw:shadow-xl tw:w-full tw:max-w-lg tw:p-6">
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-5">
          <h2 className="tw:text-xl tw:font-semibold tw:text-gray-900">New Task</h2>
          <button
            onClick={onClose}
            className="tw:text-gray-400 tw:hover:text-gray-600 tw:text-lg tw:leading-none"
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
                onChange={(e) => setStatus(e.target.value as TaskStatus | '')}
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

          {createTask.isError && (
            <p className="tw:text-red-500 tw:text-sm">Failed to create task.</p>
          )}

          <div className="tw:flex tw:justify-end tw:gap-3 tw:pt-2 tw:border-t tw:border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="tw:px-4 tw:py-2 tw:text-sm tw:border tw:border-gray-300 tw:rounded tw:hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTask.isPending || !name}
              className="tw:px-4 tw:py-2 tw:text-sm tw:bg-blue-600 tw:text-white tw:rounded tw:hover:bg-blue-700 tw:disabled:opacity-50 tw:disabled:cursor-not-allowed"
            >
              {createTask.isPending ? 'Saving...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
