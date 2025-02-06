import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, editTask, deleteTask, toggleTaskCompletion } from "../redux/TaskDetails";
import { selectFilteredTasks } from "../redux/selectFilteredTasks";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaSearch, FaEdit, FaCheck, FaTrash } from "react-icons/fa"; // Added icons

const TaskManager = () => {
  const tasks = useSelector(selectFilteredTasks);
  const dispatch = useDispatch();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Delete confirmation modal state
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // Filter for task status
  const [taskToDelete, setTaskToDelete] = useState(null); // Task to delete
  
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  useEffect(() => {
    let filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (filter === "completed") {
      filtered = filtered.filter((task) => task.status === "completed");
    } else if (filter === "incomplete") {
      filtered = filtered.filter((task) => task.status === "incomplete");
    } else if (filter === "pending") {
      filtered = filtered.filter((task) => task.status === "pending");
    } else if (filter === "overdue") {
      const currentDate = new Date().toISOString().split("T")[0];
      filtered = filtered.filter((task) => task.dueDate < currentDate);
    }

    setFilteredTasks(filtered);
  }, [searchQuery, tasks, filter]);

  const handleAddTask = (task) => {
    dispatch(addTask({ ...task, id: Date.now(), status: "pending" }));
    setModalOpen(false);
  };

  const handleEditTask = (id, updatedTask) => {
    dispatch(editTask({ id, updatedTask }));
    setModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete.id));
      setDeleteModalOpen(false);
    }
  };

  const handleToggleCompletion = (id) => {
    dispatch(toggleTaskCompletion(id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(filteredTasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
  };

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800 underline mb-8">Task Manager</h1>

        <div className="flex items-center gap-4 w-full max-w-xl mb-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-3 rounded w-full pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            {searchQuery && (
              <ul className="absolute left-0 w-full bg-white border border-gray-300 mt-1 max-h-48 overflow-y-auto z-10">
                {filteredTasks.map((task) => (
                  <li key={task.id} className="px-2 py-1 hover:bg-gray-100">
                    {task.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
            onClick={() => setModalOpen(true)}
          >
            Add Task
          </button>
        </div>

        <div className="w-full max-w-xs mb-8">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-3 border rounded w-full"
          >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Task Sections */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap gap-8 justify-center">
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="w-full max-w-4xl">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">Incomplete Tasks</h3>
                {filteredTasks.filter((task) => task.status === "incomplete").map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className="bg-white shadow-lg rounded-lg p-6 mb-4 border border-gray-200"
                      >
                        <div className="flex justify-between">
                          <h4 className="text-xl font-semibold">{task.title}</h4>
                          <div className="flex gap-4">
                            <FaEdit
                              className="text-blue-500 cursor-pointer"
                              onClick={() => {
                                setEditingTask(task);
                                setModalOpen(true);
                              }}
                            />
                            <FaCheck
                              className="text-green-500 cursor-pointer"
                              onClick={() => handleToggleCompletion(task.id)}
                            />
                            <FaTrash
                              className="text-red-500 cursor-pointer"
                              onClick={() => {
                                setTaskToDelete(task);
                                setDeleteModalOpen(true);
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-gray-600">{task.description}</p>
                        <p className="text-sm text-gray-500">Due Date: {task.dueDate}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 bg-black">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this task?</h2>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleDeleteTask}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Adding/Editing Task */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 border-4 border-white">
          <div className="bg-[#2C2B5A] p-6 rounded-lg shadow-lg w-full max-w-md border-4 border-white ">
            <h2 className="text-xl font-bold mb-4">
              {editingTask ? "Edit Task" : "Add Task"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const task = {
                  title: formData.get("title"),
                  description: formData.get("description"),
                  dueDate: formData.get("dueDate"),
                };
                if (editingTask) {
                  handleEditTask(editingTask.id, task);
                } else {
                  handleAddTask(task);
                }
              }}
              className="text-white bg-[#2C2B5A]"
            >
              <div className="mb-4">
                <label className="block text-sm">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingTask?.title || ""}
                  className="border p-2 rounded w-full bg-[#2C2B5A] bg-opacity-10"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingTask?.description || ""}
                  className="border bg-[#2C2B5A] p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  defaultValue={editingTask?.dueDate || ""}
                  className="border bg-[#2C2B5A] p-2 rounded w-full"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editingTask ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
