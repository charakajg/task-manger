import React from 'react';
import { Frequency } from '../../constants';
import { Task } from '../../state/taskStore';
import TaskForm from '../common/TaskForm'; // Import the TaskForm component
import Modal from '../../components/Modal'; // Import the new reusable Modal component

interface NewTaskViewProps {
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  newTaskPriority: string;
  setNewTaskPriority: (priority: string) => void;
  isRecurring: boolean;
  setIsRecurring: (recurring: boolean) => void;
  recurringFrequency?: Frequency;
  setRecurringFrequency: (frequency: Frequency | undefined) => void;
  taskDependencies: Partial<Task>[];
  setTaskDependencies: (dependencies: Partial<Task>[]) => void;
  handleAddTask: () => void;
  onClose: () => void;
}

const NewTaskView: React.FC<NewTaskViewProps> = ({
  newTaskTitle,
  setNewTaskTitle,
  newTaskPriority,
  setNewTaskPriority,
  isRecurring,
  setIsRecurring,
  recurringFrequency,
  setRecurringFrequency,
  taskDependencies,
  setTaskDependencies,
  handleAddTask,
  onClose,
}) => {
  // Check if required fields are filled
  const isFormValid = () => {
    return newTaskTitle.trim().length > 0 && newTaskPriority !== '';
  };

  return (
    <Modal
      title="New Task"
      onClose={onClose}
      onAction={handleAddTask}
      actionLabel="Add Task"
      actionDisabled={!isFormValid()}>
      <TaskForm
        title={newTaskTitle}
        setTitle={setNewTaskTitle}
        priority={newTaskPriority}
        setPriority={setNewTaskPriority}
        dependencies={taskDependencies}
        setDependencies={setTaskDependencies}
        disabled={false} // Always editable in NewTaskView
      />

      <div className="task-form recurring-section">
        <div className="form-group recurring-checkbox-group">
          <label htmlFor="recurring">Recurring:</label>
          <div className="checkbox-wrapper">
            <input
              className="recurring-check"
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={() => setIsRecurring(!isRecurring)}
            />
          </div>
        </div>
        {isRecurring && (
          <div className="form-group frequency-select-group">
            <label htmlFor="frequency">Frequency:</label>
            <select
              id="frequency"
              className="frequency-select"
              value={recurringFrequency}
              onChange={(e) =>
                setRecurringFrequency(e.target.value as Frequency)
              }>
              <option value={undefined}>Select Frequency</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NewTaskView;
