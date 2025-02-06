Task Management Dashboard 


  Link : https://task-management-dashboard-livid.vercel.app/




Instructions to Run the Application

Clone the repository:
git clone <repository-link>

Navigate to the project directory:
cd task-management-dashboard

Install dependencies:
npm install

Start the development server:
npm start

Open the application in your browser at:
http://localhost:5173



Key Features :
Task Functionality

Add Task:

Allow users to add tasks with the following attributes:
Title
Description
Due Date

Edit Task:

Users should be able to update the details of an existing task.
Delete Task:
Enable users to remove a task from the dashboard.
Mark as Completed:
Provide functionality to mark tasks as completed or toggle back to incomplete.

Task Filters:

Filter Options:
All Tasks: Display all tasks.
Completed Tasks: Show only completed tasks.
Pending Tasks: Show tasks that are incomplete.
Overdue Tasks: Highlight tasks with due dates earlier than the current date.


Use a modern UI library such as:
Material-Ui
Ant Design
Styled-components
Or design a custom UI with your own CSS/SCSS.
Ensure the application is responsive:
Works seamlessly on both desktop and mobile screens.

Search Functionality:
Allow users to search for tasks by their title.

Drag-and-Drop
Implement drag-and-drop functionality to reorder tasks dynamically.

Confirmation Modal:
Before deleting a task, display a confirmation modal for user verification.
Technical Specifications

Technology Stack
React: Frontend framework for building the user interface.
Redux: For state management, preferably using @reduxjs/toolkit.
JavaScript: Use ES6+ features.
CSS/SCSS: Or opt for CSS-in-JS libraries like styled-components.

Use React Router to create a basic route structure:
/tasks - Task Dashboard
/tasks/:id - Task Details Page (optional)
State Management

Use Redux Toolkit to handle global state and actions.
For asynchronous operations, use middleware such as Redux Thunk.
Deliverables





