import React from 'react';

interface TasksControlsProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  showNewTaskForm: boolean;
  setShowNewTaskForm: (value: boolean) => void;
}

const TasksControls: React.FC<TasksControlsProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  showNewTaskForm,
  setShowNewTaskForm,
}) => {
  return (
    <div className="tasks-view__controls">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">(status)</option>
        <option value="NOT DONE">NOT DONE</option>
        <option value="DONE">DONE</option>
      </select>
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}>
        <option value="">(priority)</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button
        className="new-task-btn btn-dal"
        onClick={() => setShowNewTaskForm(true)}
        disabled={showNewTaskForm}>
        New Task
      </button>
    </div>
  );
};

export default TasksControls;
