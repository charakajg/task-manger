import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaCheck, FaEdit, FaDashcube } from "react-icons/fa";
import taskStore, { Task } from "../state/taskStore"; // Assuming store is in the same directory
import { FaX } from "react-icons/fa6";
import { Frequency } from "../constants";
import EditTaskModal from "./EditTaskModal";

const TasksView = () => {
  // Access Zustand store state and actions
  const { tasks, filteredTasks, fetchTasks, addTask, updateTask, removeTask, searchTasks } = taskStore();

  // Local state for form handling
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("low");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<Frequency | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [taskDependencies, setTaskDependencies] = useState<string[]>([]);

  const [editingTask, setEditingTask] = useState<Task | null>(null);


  useEffect(() => {
    fetchTasks(); // Fetch tasks on mount
  }, [fetchTasks]);

  useEffect(() => {
    search(); // Fetch tasks on mount
  }, [searchQuery, statusFilter, priorityFilter]);

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveTask = (updatedTask: Task) => {
    updateTask(updatedTask._id, updatedTask);
    setEditingTask(null);
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() === "") {
      return; // Don't add empty tasks
    }

    addTask({
      title: newTaskTitle,
      priority: newTaskPriority,
      dependencies: taskDependencies,
      recurring: isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined
    });

    // Reset form after adding task
    setNewTaskTitle("");
    setNewTaskPriority("low");
    setTaskDependencies([]);
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  const search = async () => {
    await searchTasks({
      query: searchQuery,
      completed: statusFilter === "DONE" ? true : statusFilter === "NOT DONE" ? false : undefined,
      priority: priorityFilter
    });
  }

  const searchByQuery = async (query: string) => {
    setSearchQuery(query);
  }

  const filterByStatus = (status: string) => {
    setStatusFilter(status);
  }

  const filterByPriority = (priority: string) => {
    setPriorityFilter(priority);
  }

  const handleDependencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDependencies: string[] = Array.from(
      e.target.selectedOptions,
      (option) => option.value // Ensuring base 10 parsing
    );
    setTaskDependencies(selectedDependencies);
  };

  const markAsDone = (id: number) => {
    updateTask(id, { completed: true });
  }
  const markAsUndone = (id: number) => {
    updateTask(id, { completed: false });
  }

  return (
    <div className="tasks-view">
      <div className="controls">
        <input
          type="text"
          className="search"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => searchByQuery(e.target.value)} // Use store to manage search
        />
        <select
          className="priority-select"
          value={statusFilter}
          onChange={(e) => filterByStatus(e.target.value)}
        >
          <option value="">(status)</option>
          <option value="NOT DONE">NOT DONE</option>
          <option value="DONE">DONE</option>
        </select>
        <select
          className="priority-select"
          value={priorityFilter}
          onChange={(e) => filterByPriority(e.target.value)}
        >
          <option value="">(priority)</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th>
                Title
              </th>
              <th>
                Status
              </th>
              <th>
                Priority
              </th>
              <th>Dependencies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => {
              const dependentTasks = task.dependencies && task.dependencies.length > 0 ? task.dependencies.map((depId) => tasks.find((t) => String(t._id) == depId)) : [];
              const dependentTasksIncomplete = dependentTasks.find((depTask) => !depTask?.completed);
              return (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.completed ? "DONE" : "NOT DONE"}</td>
                  <td>{task.priority}</td>
                  <td>
                    {dependentTasks.length > 0 ? (
                      dependentTasks.map((depTask) => {
                        return <div key={depTask?._id}>{depTask ? depTask.title : "Unknown Task"}{depTask?.completed && <FaCheck />}</div>;
                      })
                    ) : (
                      "No dependencies"
                    )}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditClick(task)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="delete-btn" onClick={() => removeTask(task._id)}>
                      <FaTrashAlt /> Delete
                    </button>

                    {!task.completed && <button disabled={!!dependentTasksIncomplete} className="delete-btn" onClick={() => markAsDone(task._id)}>
                      <FaCheck /> Mark as DONE
                    </button>}
                    {task.completed && <button className="delete-btn" onClick={() => markAsUndone(task._id)}>
                      <FaX /> Mark as NOT DONE
                    </button>}
                  </td>
                </tr>)

            }
            )}
          </tbody>
        </table>
      </div>

      <div className="new-task">
        <div>
          <input
            type="text"
            className="task-input"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <select
            className="priority-select"
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            multiple
            className="dependency-select"
            value={taskDependencies.map(String)}
            onChange={handleDependencyChange}
          >
            <option value="" disabled>Select Dependencies</option>
            {tasks.map((task) => (
              <option key={task._id} value={task._id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          {/* Recurring Checkbox */}
          <div className="recurring-container">
            <input
              type="checkbox"
              id="recurring"
              checked={isRecurring}
              onChange={() => setIsRecurring(!isRecurring)}
            />
            <label htmlFor="recurring">Recurring</label>
            {/* Show Frequency Selector if Recurring is checked */}
            {isRecurring && (
              <select
                className="frequency-select"
                value={recurringFrequency}
                onChange={(e) => setRecurringFrequency(e.target.value as Frequency)}
              >
                <option value={undefined}>Select Frequency</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
            <button className="add-btn" disabled={!newTaskTitle || (isRecurring && !recurringFrequency)} onClick={handleAddTask}>
              Add Task
            </button>
          </div>
        </div>
      </div>



      {editingTask && (
        <EditTaskModal
          task={editingTask}
          tasks={tasks}
          onSave={handleSaveTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default TasksView;
