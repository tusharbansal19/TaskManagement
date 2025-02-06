import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, editTask, deleteTask, toggleTaskCompletion } from "../redux/TaskDetails";
import { selectFilteredTasks } from "../redux/selectFilteredTasks";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaSearch, FaEdit, FaCheck, FaTrash } from "react-icons/fa"; // Added icons
import TaskCard from "./TaskCard";
import { Typewriter } from "react-simple-typewriter"; // Import Typewriter
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProtectComponents";
// import { Logout } from "@mui/icons-material";

const TaskManager = ({setTaskUpdateLoading}) => {
  const navigator=useNavigate();
  // const tasks = useSelector(selectFilteredTasks);
    const { logout } = useAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Delete confirmation modal state
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // Filter for task status
  const [taskToDelete, setTaskToDelete] = useState(null); // Task to delete
const  [arrayOfTitle,serArrayOgtitle]=useState([]);
// ////////////////////console.log("these are tasks",tasks)
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [tasks, setTasks] = useState([]);
  // Handle input change to toggle the dropdown
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);  // Update the search query
    setIsDropdownOpen(query.length > 0);  // Open dropdown if query exists
  };

  // Handle selection of a task from the dropdown
  const handleSelectTask = (taskTitle) => {
    setSearchQuery(taskTitle); // Set the task title in the search bar
    setIsDropdownOpen(false);  // Close the dropdown after selection
  };

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

  useEffect(() => {
    const fetchTasks = async () => {
      if (!localStorage.getItem("token")) {
        navigator("/login");
        return;
      }
  
      setLoading(true);
      try {
        const response = await axios.post(
          "https://taskserver-ts96.onrender.com/api/tasks/get",
          { token: localStorage.getItem("token") },
          { headers: { "Content-Type": "application/json" } }
        );
  
        ////////////////////console.log("API Response:", response.data.tasks);
        setTasks(response.data.tasks);
        setTaskUpdateLoading(response.data.tasks);
        setFilteredTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch tasks. Please try again!", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
          className: "bg-red-500 text-white",
        });
        // logout();
        // localStorage.clear("token", "email");
        // navigator("/login");
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasks();
  }, [reload]); // 🔄 Trigger fetch only when reload state changes
  
  const handleAddTask = async(task) =>
     {
    setLoading(true);
    ////////////////////console.log(task);
    try {
      // API call to add task
      const response = await axios.post("https://taskserver-ts96.onrender.com/api/tasks/create", {token:localStorage.getItem("token"),
        ...task,status:"incomplete",startingDate:Date.now()
      }, {
        headers: { "Content-Type": "application/json" },
      });

      ////////////////////console.log("API Response:", response.data);
      setLoading(false);
      setReload(prev => !prev);
      dispatch(addTask({ ...task, id: Date.now(), status: "incomplete" }));
      toast.success("Task added successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      setLoading(false);
      console.error("Error adding task:", error);
      toast.error("Failed to add task. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        className: "bg-red-500 text-white",
      });
    }
    finally{
      
  setModalOpen(false);
    }
  };

  const handleEditTask = async (id, updatedTask) => {
    ////////////////////console.log("Editing Task:", id, updatedTask);
    setLoading(true);
  
    try {
      // API call to update task
      const response = await axios.put(
        "https://taskserver-ts96.onrender.com/api/tasks/update",
        {
          token: localStorage.getItem("token"),
          taskId: id,
          ...updatedTask, // Spread updated task properties directly
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setReload(prev => !prev);
      ////////////////////console.log("API Response:", response.data);
      setFilter(response.data.tasks);
      // Show success toast
      toast.success("Task updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        className: "bg-blue-500 text-white",
      });
  
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false);
      setModalOpen(false);
   
      setEditingTask(null);
    }
  };
  
const handleDeleteTask = async (id) => {
  setLoading(true);
  ////////////////////console.log(taskToDelete, "delte")
  
  try {
    const response = await axios.delete(`https://taskserver-ts96.onrender.com/api/tasks/delete`, {
      headers: { "Content-Type": "application/json" },
      data: { token: localStorage.getItem("token"),taskId:taskToDelete } // Ensure token is sent in request body
    });

    ////////////////////console.log("API Response:", response.data);
    
    toast.success("Task deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
      theme: "dark",
      className: "bg-red-500 text-white",
    });

    // Refresh tasks after deletion
    setReload(prev => !prev);
    
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("Failed to delete task. Please try again!", {
      position: "top-right",
      autoClose: 3000,
      theme: "dark",
      className: "bg-red-500 text-white",
    });
  } finally {
    setLoading(false);
    setDeleteModalOpen(false);
  }
};


  const handleToggleCompletion = async (id) => {
    ////////////////////console.log("Toggling completion for task:", id);
    setLoading(true);
  
    try {
      const response = await axios.put(
        "https://taskserver-ts96.onrender.com/api/tasks/toggle-completion",
        { token: localStorage.getItem("token"), taskId: id },
        { headers: { "Content-Type": "application/json" } }
      );
  
      ////////////////////console.log("API Response:", response.data);
      toast.success("Task status updated!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        className: "bg-purple-500 text-white",
      });
  
      // Refresh tasks after update
      setReload(prev => !prev);
      
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status. Please try again!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false);
    }
  };
  

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(filteredTasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
  };

  useEffect(() => {

    ////////////////////console.log(tasks, "tasks")
    ////////////////////console.log(filteredTasks)
    let arrayr=[]
    for(let task of tasks) {
      arrayr.push(task.title)

    }
  
    serArrayOgtitle(arrayr);

    ////////////////////console.log(arrayOfTitle)
  },[tasks])

  // tasks.map(task => task.title);
  //   ////////////////////console.log(arrayOfTitle);

  return (
    <div className="container mx-auto md:p-4 min-h-[500px] mb-28" >
      {loading && (

        <div className="w-full flex justify-center mt-4 h-full items-center  fixed  top-0 left-0  bg-black bg-opacity-30 z-[110]">
          <div className="w-12 h-12 border-4 border-dotted border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {/* Header */}
      <ToastContainer />
      <div className="flex flex-col justify-between items-center mb-6 text-[10px] sm:text-[20px]">
        <h1 className="text-2xl font-bold text-white underline mb-10">Task Manager</h1>

           
        <div className="flex items-center  justify-between mx-auto  bg-[#8E44AD] bg-opacity-35   w-full  text-[10px] sm:text-[20px]  rounded-t-lg">
        <div className="flex  flex-col  md:flex-row m-4  items-center md:gap-4 w-full justify-between p-2 ">


      <div className="relative  w-full ">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearchChange}  // Call handleSearchChange when input changes
          className="border p-2 rounded w-full w text-black pl-10"
        />
        <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />

        {/* Dropdown for search suggestions */}
        {isDropdownOpen && searchQuery && (
          <ul className="absolute left-0 w-full bg-white text-black border border-gray-300 mt-1 max-h-48 overflow-y-auto z-10">
            {filteredTasks.map((task) => (
              <li
                key={task._id}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectTask(task.title)} // Handle item click
              >
                {task.title}
              </li>
            ))}
          </ul>
        )}
      </div>



<div className=" text-[10px] sm:text-[20px] flex flex-row  justify-center items-center">

      <button
        className="bg-blue-500 text-white w-[30px] h-[30px] sm:h-[35px] sm:w-[35px] text-[30px]  shadow rounded-full hover:bg-blue-600 text-center  items-center transition text-sm "
        onClick={() => setModalOpen(true)}
        >
     +
      </button>
      <div className="mt-4 m-3 ">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded bg-[#2C2B5A]"
            >
            <option value="all">All Tasks</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
            </div>
    </div>
       
        </div>

        {/* Filter Dropdown */}
     
      </div>

      {/* Task List */}
      <div className="text-[#8E44AD]  font-extrabold my-3 text-[10px] sm:text-[20px] ">
        {/* <div className="flex items-center text-[20px] md:text-[35px]">      
      | Task : <span className="">  </span>

                               <Typewriter
                                  words={arrayOfTitle}
                                  loop={false}
                                  cursor
                                  cursorStyle="|"
                                  cursorColor={"#8E44AD"}
                                  sizing="10"
                                  delaySpeed={2000}
                                  typingSpeed={100}
                                  />
                                  </div> */}
                              </div>
                              {}
                              {loading ? (
  <div className="w-full flex justify-center mt-4 h-full items-center fixed top-0 left-0 bg-black bg-opacity-30 z-[110]">
    <div className="w-12 h-12 border-4 border-dotted border-red-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
) : (
  <DragDropContext onDragEnd={onDragEnd}>
    <div className="flex w-full">
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="w-full"
          >
            {["completed", "incomplete",].map((status) => {
              ////////////////////console.log(filteredTasks, "Filtered Tasks:");
              
              const statusTasks = filteredTasks
                ? filteredTasks.filter((task) => task.status === status)
                : [];

              ////////////////////console.log(statusTasks, "Status-specific tasks:");

              return (
                <div key={status} className="mb-6">
                  <h3 className="text-xl font-bold mb-4 capitalize underline">
                    {status} Tasks :
                  </h3>

                  {statusTasks.length === 0 ? (
                    <div className="flex justify-center items-center w-full h-40 rounded-md">
                      <p className="text-4xl font-semibold bg-opacity-25 text-red-600">
                        No Tasks Pending
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 pr-3">
                      {statusTasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={String(task._id)}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className={`shadow-md rounded-lg w-full p-4 flex flex-row relative ${
                                task.dueDate ===
                                new Date().toISOString().split("T")[0]
                                  ? "bg-red-100"
                                  : ""
                              }`}
                            >
                              <TaskCard
                                task={task}
                                setEditingTask={setEditingTask}
                                setModalOpen={setModalOpen}
                                handleToggleCompletion={handleToggleCompletion}
                                setTaskToDelete={setTaskToDelete}
                                setDeleteModalOpen={setDeleteModalOpen}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Droppable>
    </div>
  </DragDropContext>
)}


    {/* Delete Confirmation Modal */}
{isDeleteModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 bg-[#2C2B5A] z-[100]">
    <div className="text-white z-[80] bg-blue-950 p-4 sm:p-6 rounded-lg w-[90%] sm:w-[400px] border-2">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Are you sure?</h2>
      <div className="flex justify-end gap-2">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded transition duration-200 hover:bg-green-600"
          onClick={() => setDeleteModalOpen(false)}
        >
          Cancel
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded transition duration-200 hover:bg-red-600"
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
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 border-4 border-white z-[100]">
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
                  day: formData.get("day"),
                  description: formData.get("description"),
                  dueDate: formData.get("dueDate"),
                };
                if (editingTask) {
                  handleEditTask(editingTask._id, task);
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
              <div className="mb-4">
                <label className="block text-sm">Due Day</label>
                <input type="week"
                  name="day"
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




