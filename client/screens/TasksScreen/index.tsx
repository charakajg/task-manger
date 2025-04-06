import React, { useState, useEffect } from 'react';
import {
  usePrimaryTaskStore,
  useSelectionTaskStore,
  Task,
} from '../../state/taskStore';
import TasksView from './TasksView';

const TasksScreen: React.FC = () => {
  const {
    tasks,
    refreshTasks,
    fetchTasks,
    removeTask,
    updateTask,
    currentPage,
    totalPages,
    loading,
    error,
  } = usePrimaryTaskStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  // Fetch tasks for the current page when the component mounts or when page changes
  useEffect(() => {
    refreshTasks(); // Assuming 10 tasks per page
  }, [refreshTasks]);

  // Perform search whenever searchQuery, statusFilter or priorityFilter changes
  useEffect(() => {
    onSearch();
  }, [searchQuery, statusFilter, priorityFilter, currentPage]);

  // Search tasks based on filters
  const onSearch = async () => {
    await fetchTasks({
      query: searchQuery,
      completed:
        statusFilter === 'DONE'
          ? true
          : statusFilter === 'NOT DONE'
            ? false
            : undefined,
      priority: priorityFilter,
      page: currentPage, // Pass the current page
      limit: 10, // Limit the number of tasks per page (10 per page)
    });
  };

  // Handle page change (navigate between pages)
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      refreshTasks(page);
    }
  };

  return (
    <TasksView
      tasks={tasks}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      priorityFilter={priorityFilter}
      setPriorityFilter={setPriorityFilter}
      setEditingTask={setEditingTask}
      removeTask={removeTask}
      updateTask={updateTask}
      showNewTaskForm={showNewTaskForm}
      setShowNewTaskForm={setShowNewTaskForm}
      editingTask={editingTask}
      onSearch={onSearch}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      loading={loading}
      error={error}
    />
  );
};

export default TasksScreen;
