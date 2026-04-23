import React from 'react';

const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: 'tw:bg-gray-100 tw:text-gray-600',
  IN_PROGRESS: 'tw:bg-blue-100 tw:text-blue-700',
  COMPLETED: 'tw:bg-green-100 tw:text-green-700',
  ON_HOLD: 'tw:bg-amber-100 tw:text-amber-700',
  TODO: 'tw:bg-gray-100 tw:text-gray-600',
  DONE: 'tw:bg-green-100 tw:text-green-700',
};

const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  TODO: 'To Do',
  DONE: 'Done',
};

type Props = {
  status: string;
};

export default function StatusChip({ status }: Props) {
  return (
    <span
      className={`tw:text-xs tw:rounded-full tw:px-2 tw:py-0.5 tw:font-medium ${STATUS_STYLES[status] ?? 'tw:bg-gray-100 tw:text-gray-600'}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
