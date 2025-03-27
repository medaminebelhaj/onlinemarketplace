import React from "react";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactElement;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const userRole = localStorage.getItem("userRole"); // Retrieve the user role from localStorage

  if (userRole === "admin") {
    return children; // Render the component if the user is an admin
  }

  console.error("Access denied. User is not an admin.");
  return <Navigate to="/not-authorized" replace />; // Redirect non-admin users
};

export default AdminRoute;
