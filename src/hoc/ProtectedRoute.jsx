import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ children, roles }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // No token → go to login
    if (!token) {
      navigate("/login");
      return;
    }

    // If specific roles are required → check role
    if (roles && !roles.includes(role)) {
      navigate("/unauthorized"); // or redirect home
      return;
    }
  }, [navigate, roles]);

  return children;
};
