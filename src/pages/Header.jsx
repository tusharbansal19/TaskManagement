import { useState } from "react";

const Modal = ({ editingTask, onClose, onSubmit }) => {
  const [task, setTask] = useState({
    title: editingTask ? editingTask.title : '',
    description: editingTask ? editingTask.description : '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{editingTask ? "Edit Task" : "Add Task"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Task Title"
            required
          />
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Task Description"
          />
          <button type="submit">{editingTask ? "Update Task" : "Add Task"}</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
