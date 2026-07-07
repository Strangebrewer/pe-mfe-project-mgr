import { FC, useState } from 'react';
import { useGetTasksByProject } from '../gql/hooks/taskHooks';
import TaskCard from './TaskCard';
import { Button } from '@bka-stuff/pe-mfe-utils';
import CreateTaskModal from './CreateTaskModal';

const TaskList: FC<{ id?: string }> = ({ id }) => {
  const { data: tasks, isPending: tasksPending } = useGetTasksByProject(id!);
  const [showTaskModal, setShowTaskModal] = useState(false);

  return (
    <div className="tw:border-t tw:border-[rgba(188,19,254,0.2)] tw:pt-6">
      <div className="tw:flex tw:justify-between tw:items-center tw:mb-4">
        <h2 className="tw:text-lg tw:font-semibold tw:text-[#f0e6ff]">Tasks</h2>
        <Button last color="purple" text="New Task" onClick={() => setShowTaskModal(true)} />
      </div>

      {tasksPending ? (
        <p className="tw:text-[#c4b5fd] tw:text-sm">Loading tasks...</p>
      ) : !tasks?.length ? (
        <p className="tw:text-[#c4b5fd] tw:text-sm">No tasks yet.</p>
      ) : (
        <div className="tw:flex tw:flex-col tw:gap-3">
          {tasks?.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      <CreateTaskModal
        isOpen={showTaskModal}
        projectId={id!}
        onClose={() => setShowTaskModal(false)}
      />
    </div>
  );
};

export default TaskList;
