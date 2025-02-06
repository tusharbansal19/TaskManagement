// import { useEffect, useState } from "react";
// import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// import { FaPlus } from "react-icons/fa";
// import Typewriter from "typewriter-effect";
// import DailyLineChart from "./Components/DailytaskChart";
// import TaskTimeline from "./Components/VerticalLine";

// import { toast } from "react-toastify"; // Import Toastify
// import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

// const DailyTaskManager = () => {



    
//       const [isModalOpen, setModalOpen] = useState(false);
//       const [isDeleteModalOpen, setDeleteModalOpen] = useState(false); // Delete confirmation modal state
//       const [editingTask, setEditingTask] = useState(null);
      
//       const [taskToDelete, setTaskToDelete] = useState(null); // Task to delete
//     const  [arrayOfTitle,serArrayOgtitle]=useState([]);
//       const [isDropdownOpen, setIsDropdownOpen] = useState(false);
     

//       const [tasks, setTasks] = useState( [
//         {
//           "id": 1,
//           "title": "Complete React Native project",
//           "description": "Finish implementing the login screen and user authentication for the app.",
//           "dueDate": "2024-12-15",
//           "status": "pending",
//           "hours": 0,
//           "important": {
//             "startTime": "2024-12-01T09:00:00",
//             "endTime": "2024-12-15T17:00:00"
//           }
//         },
       
        
//       ]
//       );
  
    
//       const handleDeleteTask = (id) => {
//         console.log("task to delete  "+taskToDelete)
//         if (taskToDelete) {
//           dispatch(deleteTask(taskToDelete));
//           setDeleteModalOpen(false);
//           toast.error("Task deleted successfully!", {
//             position: "top-right",
//             autoClose: 3000,
//             theme: "dark",
//             className: "bg-red-500 text-white",
//           });
//         }-8
//       };
    
    
    
//       useEffect(() => {
    
//         console.log(tasks)
//         console.log(filteredTasks)
//         let arrayr=[]
//         for(let task of tasks) {
//           arrayr.push(task.title)
    
//         }
      
//         serArrayOgtitle(arrayr);
    
//         console.log(arrayOfTitle)
//       },[tasks])
    
  
  
  
  









//   const [filteredTasks, setFilteredTasks] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");

//   const [filter, setFilter] = useState("all");
 
//   const API_URL = "http://localhost:8000/dailytask"
  




// const handleAddTask = (task) => {
//   const newTask = { ...task, id: Date.now() }; // Auto-generate id based on timestamp
//   setTasks((prevTasks) => {
//     const updatedTasks = [...prevTasks, newTask];
//     // Sort tasks based on the startTime in ascending order
//     updatedTasks.sort((a, b) => new Date(a.important.startTime) - new Date(b.important.startTime));
//     return updatedTasks;
//   });
//   setModalOpen(false); // Close modal after adding the task
// };

// const handleEditTask = (id, task) => {
//   setTasks((prevTasks) => {
//     const updatedTasks = prevTasks.map((t) => (t.id === id ? { ...t, ...task } : t));
//     // Sort tasks based on the startTime in ascending order
//     updatedTasks.sort((a, b) => new Date(a.important.startTime) - new Date(b.important.startTime));
//     return updatedTasks;
//   });
//   setModalOpen(false); // Close modal after editing the task
// };

//   const taskCompletionData = tasks.reduce(
//     (acc, task) => {
//       if (task.status === "completed") acc.completed += 1;
//       else acc.incomplete += 1;
//       return acc;
//     },
//     { completed: 0, incomplete: 0 }
//   );

//   const totalHours = tasks.reduce((acc, task) => acc + task.hours, 0);
//   const remainingHours = tasks.reduce(
//     (acc, task) => (task.status !== "completed" ? acc + task.hours : acc),
//     0
//   );

 
//   return (
//     <div className="container mx-auto md:p-4 bg-gray-900  min-h-[500px] w-[100%] pt-28 mb-28 m-0 ">
//       <div className="flex flex-col justify-between items-center mb-6 text-[10px] sm:text-[20px] w-full">
//         <h1 className="text-2xl font-bold text-white underline mb-10">Task Manager</h1>

//         <div className="text-[#8E44AD] font-extrabold my-3 text-[10px] sm:text-[20px]">
//           <div className="flex items-center text-[20px] md:text-[35px]">
//             | Task:{" "}
//             <span className="">
//               <Typewriter
//                 words={arrayOfTitle}
//                 loop={false}
//                 cursor
//                 cursorStyle="|"
//                 cursorColor={"#8E44AD"}
//                 sizing="10"
//                 delaySpeed={2000}
//                 typingSpeed={100}
//               />
//             </span>
//           </div>
//           <div className=" relative flex items-center gap-x-2l;"> <div className="text-white"> add new</div> <button
//           onClick={() => {
//             setEditingTask(null); // Clear editing task when adding a new one
//             setModalOpen(true);
//           }}
//           className="  my-3 
//            bottom-[40%] right-[10%] bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
//         >
//           <FaPlus size={24} />
//         </button></div>
//         </div>



// <div className="w-full">   {/* Modal to Add/Edit Task */}
// {isModalOpen && (
//   <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 border-4 border-white z-[100]  overflow-y-auto">
//     <div className="bg-[#2C2B5A] p-6 rounded-lg shadow-lg w-full max-w-md border-4 border-white ">
//       <h2 className="text-xl font-bold mb-4">
//         {editingTask ? "Edit Task" : "Add Task"}
//       </h2>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           const formData = new FormData(e.target);
//           const task = {
//             title: formData.get("title"),
//             description: formData.get("description"),
//             dueDate: formData.get("dueDate"),
//             status: formData.get("status"),
//             hours: parseInt(formData.get("hours"), 10), // Convert hours to integer
//             important: {
//               startTime: formData.get("startTime"),
//               endTime: formData.get("endTime"),
//             },
//           };
//           if (editingTask) {
//             handleEditTask(editingTask.id, task);
//           } else {
//             handleAddTask(task);
//           }
//         }}
//         className="text-white bg-[#2C2B5A]"
//       >
//         <div className="mb-4">
//           <label className="block text-sm">Title</label>
//           <input
//             type="text"
//             name="title"
//             defaultValue={editingTask?.title || ""}
//             className="border p-2 rounded w-full bg-[#2C2B5A] bg-opacity-10"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm">Description</label>
//           <textarea
//             name="description"
//             defaultValue={editingTask?.description || ""}
//             className="border bg-[#2C2B5A] p-2 rounded w-full"
//             required
//           />
//         </div>
//         {isDeleteModalOpen && (
//   <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 bg-[#2C2B5A] z-[100]">
//     <div className="text-white z-[80] bg-blue-950 p-4 sm:p-6 rounded-lg w-[90%] sm:w-[400px] border-2">
//       <h2 className="text-xl sm:text-2xl font-bold mb-4">Are you sure?</h2>
//       <div className="flex justify-end gap-2">
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded transition duration-200 hover:bg-green-600"
//           onClick={() => setDeleteModalOpen(false)}
//         >
//           Cancel
//         </button>
//         <button
//           className="bg-red-500 text-white px-4 py-2 rounded transition duration-200 hover:bg-red-600"
//           onClick={handleDeleteTask}
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//       <div className=" flex gap-x-1">

//         <div className="mb-4">
//           <label className="block text-sm">Status</label>
//           <select
//             name="status"
//             defaultValue={editingTask?.status || "pending"}
//             className="border bg-[#2C2B5A] p-2 rounded w-full"
//             required
//             >
//             <option value="pending">Pending</option>
//             <option value="completed">Completed</option>
//             <option value="in-progress">In Progress</option>
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm">Hours</label>
//           <input
//             type="number"
//             name="hours"
//             defaultValue={editingTask?.hours || 0}
//             className="border p-2 rounded w-full bg-[#2C2B5A] bg-opacity-10"
//             required
//             />
//         </div>
//             </div>
//         <div className="mb-4">
//           <label className="block text-sm">Start Time</label>
//           <input
//             type="datetime-local"
//             name="startTime"
//             defaultValue={editingTask?.important.startTime || ""}
//             className="border p-2 rounded w-full bg-[#2C2B5A] bg-opacity-10"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block text-sm">End Time</label>
//           <input
//             type="datetime-local"
//             name="endTime"
//             defaultValue={editingTask?.important.endTime || ""}
//             className="border p-2 rounded w-full bg-[#2C2B5A] bg-opacity-10"
//             required
//           />
//         </div>
//         <div className="flex justify-end gap-2">
//           <button
//             type="button"
//             className="bg-gray-500 text-white px-4 py-2 rounded"
//             onClick={() => setModalOpen(false)}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             {editingTask ? "Save" : "Add"}
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}


//         {/* Floating Add Task Button */}
      
// </div>








//         <div className="w-full">
















// <TaskTimeline tasks={tasks} handleDeleteTask={handleDeleteTask} handleEditTask={handleEditTask} />
//         </div>
//         {/* Search Section */}
//         <div className="flex items-center justify-center gap-4 w-full sm:pr-20 text-[10px] sm:text-[20px] flex-col">
//           <div className="relative w-[80%] md:w-full">
           
          
//           </div>
//         </div>

//         {/* Task Summary */}
//           <DailyLineChart tasks={tasks}/>
//         <div className="flex justify-around w-full text-[10px] sm:text-[20px] mt-8 lg:px-10">
//         <div className="p-10 bg-[#2C2B5A] text-white rounded-lg">
//   <p className="hover:bg-[#4CAF50] hover:cursor-pointer p-2 rounded-md transition-all duration-200">
//     Completed Tasks: {taskCompletionData.completed}
//   </p>
//   <p className="hover:bg-[#FF5733] hover:cursor-pointer p-2 rounded-md transition-all duration-200">
//     Incomplete Tasks: {taskCompletionData.incomplete}
//   </p>
//   <p className="hover:bg-[#FFD700] hover:cursor-pointer p-2 rounded-md transition-all duration-200">
//     Total Hours: {totalHours}
//   </p>
//   <p className="hover:bg-[#00BFFF] hover:cursor-pointer p-2 rounded-md transition-all duration-200">
//     Remaining Hours: {remainingHours}
//   </p>
// </div>


//           {/* Pie Chart */}





//           <div className="w-full sm:w-[60%] md:w-[50%] lg:w-[40%] flex justify-center items-center p-4 text-sm">
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={[
//               { name: "Completed", value: taskCompletionData.completed },
//               { name: "Incomplete", value: taskCompletionData.incomplete },
//             ]}
//             dataKey="value"
//             nameKey="name"
//             cx="50%"
//             cy="50%"
//             outerRadius={100}
//             fill="#8884d8"
//             labelLine={false} // Disable connecting lines from labels
//             label={({ name, value, percent }) => {
//               return `${name}: ${value} (${(percent * 100).toFixed(0)}%)`; // Custom label
//             }}
//           >
//             <Cell fill="#4CAF50" />
//             <Cell fill="#FF0000" />
//           </Pie>
//           <Tooltip />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>




       
//         </div>

//         {/* Line Chart */}
       
//       </div>
//     </div>
//   );
// };

// export default DailyTaskManager;
// //-----------------------------------------
// // const fetchTasks = async (setLoading) => {
// //   try {
// //     setLoading(true);
// //     const response = await axios.get(API_URL);
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error fetching tasks:", error);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// // // Add a new task
// // const addTask = async (taskData, setLoading) => {
// //   try {
// //     setLoading(true);
// //     const response = await axios.post(API_URL, taskData);
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error adding task:", error);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// // // Update a task
// // const updateTask = async (taskId, taskData, setLoading) => {
// //   try {
// //     setLoading(true);
// //     const response = await axios.put(`${API_URL}/${taskId}`, taskData);
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error updating task:", error);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// // // Delete a task
// // const deleteTask = async (taskId, setLoading) => {
// //   try {
// //     setLoading(true);
// //     const response = await axios.delete(`${API_URL}/${taskId}`);
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error deleting task:", error);
// //   } finally {
// //     setLoading(false);
// //   }
// // };



// // const handleSearchChange = (e) => {
// //   setSearchQuery(e.target.value);
// //   setIsDropdownOpen(true);
// //   filterTasks(e.target.value);
// // };

// // const filterTasks = (query) => {
// //   if (!query) {
// //     setFilteredTasks(tasks);
// //     return;
// //   }
// //   const result = tasks.filter((task) =>
// //     task.title.toLowerCase().includes(query.toLowerCase())
// //   );
// //   setFilteredTasks(result);
// // };

// // const handleSelectTask = (title) => {
// //   setSearchQuery(title);
// //   setIsDropdownOpen(false);
// // };
