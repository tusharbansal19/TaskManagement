import React from "react";
import { NavLink } from "react-router-dom";
import { Box, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import FilterListIcon from "@mui/icons-material/FilterList";
import SettingsIcon from "@mui/icons-material/Settings";

const TSidebar = () => {
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Tasks", icon: <TaskIcon />, path: "/tasks" },
   
  ];

  return (
    <Box
      className=" hidden md:flex flex-col fixed left-0 top-0 w-36 h-screen bg-[#2A265F] text-white pt-20 text-[1rem]"
    >
      {/* Menu List */}
      <List className="flex flex-col space-y-2">
        {menuItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={({ isActive }) =>
              `flex items-center  py-2 rounded-r-full ${
                isActive ? "bg-[#3B3B80] text-white" : "text-[#AFAFDF]"
              } hover:bg-[#3B3B80]`
            }
          >
            <ListItemIcon className="text-inherit">{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </NavLink>
        ))}
      </List>
    </Box>
  );
};

export default TSidebar;
