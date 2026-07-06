import React, { useState } from 'react';
import { useCreateProject } from '../gql/hooks/projectHooks';
import { ProjectStatus } from '../types/projectMgr';
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
  isOpen: boolean;
  onClose: () => void;
};

const STATUS_OPTIONS = [
  { value: ProjectStatus.NOT_STARTED, label: 'Not Started' },
  { value: ProjectStatus.IN_PROGRESS, label: 'In Progress' },
  { value: ProjectStatus.COMPLETED, label: 'Completed' },
  { value: ProjectStatus.ON_HOLD, label: 'On Hold' },
];

export default function CreateProjectModal({ onClose, isOpen }: Props) {
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
    <Modal isOpen={isOpen} close={onClose}>
      <ModalContent heading="New Project">
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
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus | '')}
              >
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

          {createProject.isError && (
            <p className="tw:text-[#e22c5a] tw:text-sm">Failed to create project.</p>
          )}

          <ModalButtons
            onClose={onClose}
            confirmText={createProject.isPending ? 'Saving...' : 'Create Project'}
            confirmColor="blue"
            isDisabled={createProject.isPending || !name}
          />
        </form>
      </ModalContent>
    </Modal>
  );
}
