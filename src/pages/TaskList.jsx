import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

const TaskList = ({ tasks, onEdit, onDelete, onComplete }) => (
  <Droppable droppableId="tasks">
    {(provided) => (
      <div {...provided.droppableProps} ref={provided.innerRef} className="grid gap-4">
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
            {(provided) => (
              <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                className="bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <h2 className="text-lg font-bold">{task.title}</h2>
                <p>{task.description}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => onEdit(task)}>Edit</button>
                  <button onClick={() => onComplete(task.id)}>Complete</button>
                  <button onClick={() => onDelete(task.id)}>Delete</button>
                </div>
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default TaskList;
