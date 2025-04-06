import React, { useEffect, useState } from 'react';
import { Task, useSelectionTaskStore } from '../../../state/taskStore';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface TaskFormProps {
  task?: Task;
  title: string;
  setTitle: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;
  dependencies: Partial<Task>[];
  setDependencies: (value: Partial<Task>[]) => void;
  disabled: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  title,
  setTitle,
  priority,
  setPriority,
  dependencies,
  setDependencies,
  disabled,
}) => {
  const {
    tasks,
    refreshTasks,
    fetchTasks,
    currentPage,
    totalPages,
    itemsPerPage,
  } = useSelectionTaskStore();

  const [newDependencies, setNewDependencies] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    // Initial load of tasks
    fetchTasks({ page: 1, limit: 5 });
  }, [fetchTasks]);

  const handleDependencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDependencies = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setNewDependencies(selectedDependencies);
  };

  const addDeps = () => {
    const existingIds = new Set(dependencies.map((item) => String(item._id)));
    if (task) {
      existingIds.add(String(task._id));
    }
    const newRecordIds = newDependencies.filter((_id) => !existingIds.has(_id));
    const newDeps = newRecordIds
      .map((id) => tasks.find((t) => String(t._id) == id))
      .filter((e) => !!e);
    setDependencies([...dependencies, ...newDeps]);
  };
  const removeDep = (dep: Partial<Task>) => {
    setDependencies([...dependencies.filter((e) => e._id != dep._id)]);
  };

  return (
    <div className="task-form">
      <div className="form-group">
        <label htmlFor="task-title">Title:</label>
        <input
          id="task-title"
          type="text"
          value={title}
          placeholder="Enter task title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-priority">Priority:</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-group dependencies-group">
        <label>Dependencies:</label>
        <div className="dependencies-container">
          <div className="depencency-selection">
            <div className="dep-list">
              <h4>Current Dependencies</h4>
              {dependencies && dependencies.length > 0 ? (
                <ul>
                  {dependencies.map((dep) => (
                    <li key={dep._id}>
                      {dep.title}
                      {!disabled && (
                        <button
                          className="btn-dal"
                          onClick={() => removeDep(dep)}>
                          X
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-list">No dependencies added</div>
              )}
            </div>

            {!disabled && (
              <div className="dep-search">
                <h4>Add Dependencies</h4>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    setSearchQuery(query);
                    fetchTasks({ query, page: 1, limit: 5 });
                    setPage(1);
                  }}
                />
                <select
                  multiple
                  value={newDependencies}
                  onChange={handleDependencyChange}>
                  {tasks.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title}
                    </option>
                  ))}
                </select>

                <div className="pagination-controls">
                  <button
                    className="pagination-btn"
                    onClick={() => {
                      const prevPage = Math.max(1, page - 1);
                      setPage(prevPage);
                      fetchTasks({
                        query: searchQuery,
                        page: prevPage,
                        limit: 5,
                      });
                    }}
                    disabled={page <= 1}>
                    <FaArrowLeft size={12} />
                  </button>
                  <span className="pagination-info">
                    {page} of {totalPages || 1}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => {
                      const nextPage = Math.min(totalPages || 1, page + 1);
                      setPage(nextPage);
                      fetchTasks({
                        query: searchQuery,
                        page: nextPage,
                        limit: 5,
                      });
                    }}
                    disabled={page >= (totalPages || 1)}>
                    <FaArrowRight size={12} />
                  </button>

                  <div className="add-dependency-btn">
                    <button
                      className="btn-dal"
                      onClick={addDeps}
                      title="Add selected dependencies"
                      disabled={newDependencies.length === 0}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
