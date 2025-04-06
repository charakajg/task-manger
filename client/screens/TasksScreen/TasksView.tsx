import React from 'react';
import { Task } from '../../state/taskStore';
import EditTaskForm from '../EditTaskForm';
import NewTaskForm from '../NewTaskForm';
import TasksControls from './TasksControls';
import TasksList from './TasksList';

interface TasksViewProps {
  tasks: Task[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  setEditingTask: (task: Task | null) => void;
  removeTask: (id: number) => void;
  updateTask: (
    id: number,
    changes: {
      title?: string;
      priority?: string;
      completed?: boolean;
      dependencies?: string[];
    },
  ) => Promise<void>;
  showNewTaskForm: boolean;
  setShowNewTaskForm: (value: boolean) => void;
  editingTask: Task | null;
  onSearch: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean; // Adding loading state
  error: string | null;
}

const TasksView: React.FC<TasksViewProps> = (props) => {
  const {
    tasks,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    setEditingTask,
    removeTask,
    updateTask,
    showNewTaskForm,
    setShowNewTaskForm,
    editingTask,
    currentPage,
    totalPages,
    onPageChange,
    loading,
    error,
  } = props;

  return (
    <div className="tasks-view">
      <TasksControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        showNewTaskForm={showNewTaskForm}
        setShowNewTaskForm={setShowNewTaskForm}
      />

      {error && <div className="error-message">{error}</div>}
      {/* Display loading spinner when fetching tasks */}
      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <TasksList
          tasks={tasks}
          handleEditClick={setEditingTask}
          removeTask={removeTask}
          updateTask={updateTask}
        />
      )}

      {showNewTaskForm && (
        <NewTaskForm onClose={() => setShowNewTaskForm(false)} />
      )}
      {editingTask && (
        <EditTaskForm task={editingTask} onClose={() => setEditingTask(null)} />
      )}

      {/* Pagination controls */}
      <div className="pagination-controls">
        {currentPage > 1 && (
          <button
            className="btn-dal"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={loading}>
            Previous
          </button>
        )}

        <span>
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages && (
          <button
            className="btn-dal"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={loading}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TasksView;
