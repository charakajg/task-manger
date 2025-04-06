import React from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { Task } from '../../state/taskStore';
import TaskForm from '../common/TaskForm'; // Import the TaskForm component
import Modal from '../../components/Modal'; // Import the new reusable Modal component

interface EditTaskViewProps {
  title: string;
  setTitle: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
  dependencies: Partial<Task>[];
  setDependencies: (value: Partial<Task>[]) => void;
  task: Task;
  onSave: () => void;
  onClose: () => void;
}

const EditTaskView: React.FC<EditTaskViewProps> = ({
  title,
  setTitle,
  priority,
  setPriority,
  dependencies,
  setDependencies,
  task,
  onSave,
  onClose,
}) => {
  // Check if form is valid for saving
  const isFormValid = () => {
    return title.trim().length > 0 && priority !== '';
  };

  return (
    <Modal
      title="Edit Task"
      onClose={onClose}
      onAction={onSave}
      actionDisabled={!isFormValid()}
      actionLabel={
        <>
          <FaSave /> Save
        </>
      }>
      <TaskForm
        task={task}
        title={title}
        setTitle={setTitle}
        priority={priority}
        setPriority={setPriority}
        dependencies={dependencies}
        setDependencies={setDependencies}
        disabled={task.completed}
      />

      {task.completed && (
        <label>
          Note that dependencies cannot be edited in already completed tasks
        </label>
      )}
    </Modal>
  );
};

export default EditTaskView;
