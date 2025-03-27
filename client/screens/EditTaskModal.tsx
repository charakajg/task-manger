import React, { useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import { Task } from "../state/taskStore";

interface EditTaskModalProps {
  task: Task;
  tasks: Task[];
  onSave: (updatedTask: Task) => void;
  onClose: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, tasks, onSave, onClose }) => {
  const [title, setTitle] = useState<string>(task.title);
  const [priority, setPriority] = useState<string>(task.priority);
  const [dependencies, setDependencies] = useState<string[]>(task.dependencies || []);

  const handleDependencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDependencies = Array.from(e.target.selectedOptions, (option) => option.value);
    setDependencies(selectedDependencies);
  };

  const handleSave = () => {
    onSave({
      ...task,
      title,
      priority,
      dependencies,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Task</h2>

        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Priority:</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}> 
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <br/>

        {task.completed && <label>Note that dependencies cannot be edited in already completed tasks</label>}
        <br/>
        <label>Dependencies:</label>
        <select disabled={task.completed} multiple value={dependencies} onChange={handleDependencyChange}>
          {tasks.map((t) => (
            <option key={t._id} value={t._id}>
              {t.title}
            </option>
          ))}
        </select>

        <div className="modal-buttons">
          <button onClick={handleSave}><FaSave /> Save</button>
          <button onClick={onClose}><FaTimes /> Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
