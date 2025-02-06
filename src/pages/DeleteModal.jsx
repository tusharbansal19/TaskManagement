import React from "react";

const DeleteModal = ({ isOpen, onConfirm, onCancel }) => {
  return (
    isOpen && (
      <div className="modal">
        <p>Are you sure you want to delete this task?</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    )
  );
};

export default DeleteModal;
