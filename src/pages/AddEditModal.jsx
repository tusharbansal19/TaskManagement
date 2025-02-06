import React from "react";

const AddEditModal = ({ isOpen, task, onSubmit, onClose }) => {
  return (
    isOpen && (
      <div className="modal">
        {/* Modal logic and form */}
        <h2>{task ? "Edit Task" : "Add Task"}</h2>
        <form onSubmit={onSubmit}>
          <input type="text" name="title" defaultValue={task?.title || ""} />
          <textarea name="description" defaultValue={task?.description || ""} />
          <input type="date" name="dueDate" defaultValue={task?.dueDate || ""} />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    )
  );
};

export default AddEditModal;
