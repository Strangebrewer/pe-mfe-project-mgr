import React, { useState } from 'react';
import { useCreateTask } from '../gql/hooks/taskHooks';
import { TaskStatus } from '../types/projectMgr';
import {
  Input,
  InputGroup,
  Modal,
  ModalButtons,
  ModalContent,
  Select,
  Textarea,
} from '@bka-stuff/pe-mfe-utils';

type Props = {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
};

const STATUS_OPTIONS = [
  { value: TaskStatus.TODO, label: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
];

export default function CreateTaskModal({ projectId, onClose, isOpen }: Props) {
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
    <Modal isOpen={isOpen} close={onClose}>
      <ModalContent heading="New Task">
        <form onSubmit={handleSubmit} className="tw:flex tw:flex-col tw:gap-4">
          <InputGroup label="Name *">
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </InputGroup>

          <InputGroup label="Description">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </InputGroup>

          <div className="tw:grid tw:grid-cols-2 tw:gap-3">
            <InputGroup label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus | '')}>
                <option value="">None</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </InputGroup>

            <InputGroup label="Due Date">
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </InputGroup>
          </div>

          {createTask.isError && (
            <p className="tw:text-[#e22c5a] tw:text-sm">Failed to create task.</p>
          )}

          <ModalButtons
            onClose={onClose}
            confirmText={createTask.isPending ? 'Saving...' : 'Create Task'}
            isDisabled={createTask.isPending || !name}
          />
        </form>
      </ModalContent>
    </Modal>
  );
}
