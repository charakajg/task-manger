import React, { useEffect, useState } from 'react';
import { Task, usePrimaryTaskStore } from '../../state/taskStore';
import EditTaskView from './EditTaskView';

interface EditTaskFormProps {
  task: Task;
  onClose: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onClose }) => {
  const { updateTask } = usePrimaryTaskStore();

  const [title, setTitle] = useState<string>(task.title);
  const [priority, setPriority] = useState<string>(task.priority);
  const [dependencies, setDependencies] = useState<Partial<Task>[]>(
    task.dependencies,
  );

  const handleSave = () => {
    updateTask(task._id, {
      ...task,
      title,
      priority,
      dependencies: dependencies.map((dep) => String(dep._id)),
    });
    onClose();
  };

  return (
    <EditTaskView
      title={title}
      setTitle={setTitle}
      priority={priority}
      setPriority={setPriority}
      dependencies={dependencies}
      setDependencies={setDependencies}
      task={task}
      onSave={handleSave}
      onClose={onClose}
    />
  );
};

export default EditTaskForm;
