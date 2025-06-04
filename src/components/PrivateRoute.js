// src/components/PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
