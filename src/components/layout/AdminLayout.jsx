import React from "react";
import Sidebar from "./Sidebar"; // Import Sidebar
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
    <Sidebar/>
    <Outlet />
  </>
  );
};

export default AdminLayout;
