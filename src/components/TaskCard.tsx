import { useState } from 'react';
import { useDeleteTask, useUpdateTask } from '../gql/hooks/taskHooks';
import { TaskStatus } from '../types/projectMgr';
import StatusChip from './StatusChip';
import type { Task } from '../types/projectMgr';
import { Button, GhostButton, Input, Select, Textarea } from '@bka-stuff/pe-mfe-utils';

type Props = {
  task: Task;
};

const inputCls =
  'tw:w-full tw:border tw:border-[#BC13FE] tw:rounded tw:px-3 tw:py-1.5 tw:text-sm tw:bg-[#0d0a14] tw:text-[#f0e6ff] tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[#BC13FE]';

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
    <div className="tw:border tw:border-[rgba(188,19,254,0.3)] tw:rounded-lg tw:p-4">
      {editing ? (
        <div className="tw:flex tw:flex-col tw:gap-3">
          <Input value={draft.name} onChange={(e) => patch({ name: e.target.value })} full />
          <Textarea
            value={draft.description ?? ''}
            onChange={(e) => patch({ description: e.target.value || undefined })}
            rows={2}
            placeholder="Description"
            full
          />
          <div className="tw:grid tw:grid-cols-2 tw:gap-3">
            <Select
              value={draft.status ?? ''}
              onChange={(e) => patch({ status: (e.target.value as TaskStatus) || undefined })}
            >
              <option value="">No status</option>
              {TASK_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <Input
              type="date"
              value={draft.dueDate ?? ''}
              onChange={(e) => patch({ dueDate: e.target.value || undefined })}
            />
          </div>
          {updateTask.isError && (
            <p className="tw:text-[#e22c5a] tw:text-xs">Failed to save changes.</p>
          )}
          <div className="tw:flex tw:gap-2 tw:justify-end">
            <GhostButton onClick={cancelEdit} color="red" text="Cancel" size="sm" last />
            <Button
              onClick={save}
              text={updateTask.isPending ? 'Saving...' : 'Save'}
              color="purple"
              disabled={updateTask.isPending || !draft.name}
              small
              last
            />
          </div>
        </div>
      ) : (
        <div className="tw:flex tw:items-start tw:gap-4">
          <div className="tw:flex-1 tw:min-w-0">
            <p className="tw:font-medium tw:text-[#f0e6ff]">{task.name}</p>
            {task.description && (
              <p className="tw:text-sm tw:text-[#c4b5fd] tw:mt-0.5">{task.description}</p>
            )}
          </div>
          <div className="tw:flex tw:items-center tw:gap-2 tw:shrink-0">
            {task.status && <StatusChip status={task.status} />}
            {task.dueDate && (
              <span className="tw:text-xs tw:text-[#c4b5fd]">Due {task.dueDate}</span>
            )}
            {confirmDelete ? (
              <>
                <span className="tw:text-sm tw:text-[#c4b5fd]">Delete?</span>
                <Button
                  onClick={handleDelete}
                  text={deleteTask.isPending ? 'Deleting...' : 'Yes'}
                  color="red"
                  disabled={deleteTask.isPending}
                  small
                  last
                />
                <Button onClick={() => setConfirmDelete(false)} text="No" color="blue" small last />
              </>
            ) : (
              <>
                <GhostButton onClick={enterEdit} text="Edit" color="blue" size="sm" last />
                <Button
                  onClick={() => setConfirmDelete(true)}
                  text="Delete"
                  color="red"
                  small
                  last
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
