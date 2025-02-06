import React from "react";

const ToastNotification = ({ type, text, onClose }) => {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded ${colors[type]}`}>
      <p>{text}</p>
      <button onClick={onClose}>X</button>
    </div>
  );
};

export default ToastNotification;
