import React from 'react';
import { Task } from '../../../state/taskStore';
import StatusIcon from '../../../components/StatusIcon';

interface ChildTaskEntryProps {
  task: Partial<Task>;
}

const ChildTaskEntry: React.FC<ChildTaskEntryProps> = ({ task }) => {
  return (
    <div key={task._id}>
      <StatusIcon completed={!!task.completed} size={10} />
      {task ? task.title : 'Unknown Task'}
    </div>
  );
};

export default ChildTaskEntry;
