<VerticalTimelineElement
  key={task.id}
  className="vertical-timeline-element--work hover:bg-opacity-80 transition duration-300 ease-in-out"
  date={<span className="text-sm sm:text-base">{task.dueDate}</span>}
  iconStyle={{
    background: index % 2 === 0 ? "rgb(33, 150, 243)" : "rgb(233, 30, 99)",
    color: "#fff",
  }}
  icon={index % 2 === 0 ? <FaHourglassHalf /> : <FaCheckCircle />}
  onClick={() => handlePointClick(task)}
>
  <h3 className="vertical-timeline-element-title text-lg sm:text-xl font-semibold text-center sm:text-left">
    {task.title}
  </h3>
  <p className="vertical-timeline-element-description text-xs sm:text-sm text-gray-300 mt-2 text-center sm:text-left">
    Due at: {task.dueDate}
  </p>
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
</VerticalTimelineElement> 
