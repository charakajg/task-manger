import React from 'react';
import { Task } from '../../state/taskStore';
import TasksEntry from './TasksEntry';

interface TasksListProps {
  tasks: Task[];
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

const TasksList: React.FC<TasksListProps> = ({
  tasks,
  handleEditClick,
  removeTask,
  updateTask,
}) => {
  return (
    <div className="tasks-view__entries">
      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Dependencies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <TasksEntry
              key={task._id}
              task={task}
              handleEditClick={handleEditClick}
              removeTask={removeTask}
              updateTask={updateTask}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksList;
