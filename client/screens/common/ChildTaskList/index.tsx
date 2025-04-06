import React from 'react';
import { Task } from '../../../state/taskStore';
import ChildTaskEntry from './ChildTaskEntry';

interface ChildTaskListProps {
  childTasks: Partial<Task>[];
  taskLabel: string;
}

const ChildTaskList: React.FC<ChildTaskListProps> = ({
  childTasks,
  taskLabel,
}) => {
  return (
    <div>
      {childTasks.length > 0
        ? childTasks.map((task) => (
            <ChildTaskEntry key={task._id} task={task} />
          ))
        : `No ${taskLabel} tasks`}
    </div>
  );
};

export default ChildTaskList;
