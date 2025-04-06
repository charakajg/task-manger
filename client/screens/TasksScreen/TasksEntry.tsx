import React from 'react';
import { FaTrashAlt, FaCheck, FaEdit } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { Task } from '../../state/taskStore';
import ChildTaskList from '../common/ChildTaskList';
import StatusIcon from '../../components/StatusIcon';

interface TasksEntryItemProps {
  task: Task;
  handleEditClick: (task: Task) => void;
  removeTask: (id: number) => void;
  updateTask: (
    id: number,
    changes: {
      title?: string;
      priority?: string;
      completed?: boolean;
      dependencies?: string[];
    },
  ) => void;
}

const TasksEntry: React.FC<TasksEntryItemProps> = ({
  task,
  handleEditClick,
  removeTask,
  updateTask,
}) => {
  const dependentTasks =
    task.dependencies && task.dependencies.length > 0 ? task.dependencies : [];
  const dependentTasksIncomplete = dependentTasks.find(
    (depTask) => !depTask?.completed,
  );
  return (
    <tr className="task-entry">
      <td>{task.title}</td>
      <td>
        <StatusIcon completed={task.completed} showLabel={true} />
      </td>
      <td>{task.priority}</td>
      <td>
        <ChildTaskList childTasks={dependentTasks} taskLabel="dependent" />
      </td>
      <td>
        <button onClick={() => handleEditClick(task)}>
          <FaEdit /> Edit
        </button>
        <button onClick={() => removeTask(task._id)}>
          <FaTrashAlt /> Delete
        </button>
        {!task.completed ? (
          <button
            disabled={!!dependentTasksIncomplete}
            onClick={() => updateTask(task._id, { completed: true })}>
            <FaCheck /> Mark as Done
          </button>
        ) : (
          <button onClick={() => updateTask(task._id, { completed: false })}>
            <FaX /> Mark as Not Done
          </button>
        )}
      </td>
    </tr>
  );
};

export default TasksEntry;
