import React, { useEffect, useState } from 'react';
import {
  Task,
  usePrimaryTaskStore,
  useSelectionTaskStore,
} from '../../state/taskStore';
import { Frequency } from '../../constants';
import NewTaskView from './NewTaskView';

interface NewTaskFormProps {
  onClose: () => void;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onClose }) => {
  const { addTask } = usePrimaryTaskStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('low');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<
    Frequency | undefined
  >();
  const [taskDependencies, setTaskDependencies] = useState<Partial<Task>[]>([]);

  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') return;

    addTask({
      title: newTaskTitle,
      priority: newTaskPriority,
      dependencies: taskDependencies.map((dep) => String(dep._id)),
      recurring: isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
    });

    setNewTaskTitle('');
    setNewTaskPriority('low');
    setTaskDependencies([]);
    setIsRecurring(false);
    setRecurringFrequency(undefined);

    onClose(); // Close form after adding
  };

  return (
    <NewTaskView
      newTaskTitle={newTaskTitle}
      setNewTaskTitle={setNewTaskTitle}
      newTaskPriority={newTaskPriority}
      setNewTaskPriority={setNewTaskPriority}
      isRecurring={isRecurring}
      setIsRecurring={setIsRecurring}
      recurringFrequency={recurringFrequency}
      setRecurringFrequency={setRecurringFrequency}
      taskDependencies={taskDependencies}
      setTaskDependencies={setTaskDependencies}
      handleAddTask={handleAddTask}
      onClose={onClose}
    />
  );
};

export default NewTaskForm;
