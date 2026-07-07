const STATUS_STYLES: Record<string, string> = {
  NOT_STARTED: 'tw:bg-[rgba(196,181,253,0.15)] tw:text-[#c4b5fd]',
  IN_PROGRESS: 'tw:bg-[rgba(0,229,255,0.15)] tw:text-[#00E5FF]',
  COMPLETED: 'tw:bg-[rgba(81,203,32,0.15)] tw:text-[#51CB20]',
  ON_HOLD: 'tw:bg-[rgba(245,158,11,0.15)] tw:text-[#f59e0b]',
  TODO: 'tw:bg-[rgba(196,181,253,0.15)] tw:text-[#c4b5fd]',
  DONE: 'tw:bg-[rgba(81,203,32,0.15)] tw:text-[#51CB20]',
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
      className={`tw:text-xs tw:rounded-full tw:px-2 tw:py-0.5 tw:font-medium ${STATUS_STYLES[status] ?? 'tw:bg-[rgba(196,181,253,0.15)] tw:text-[#c4b5fd]'}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
