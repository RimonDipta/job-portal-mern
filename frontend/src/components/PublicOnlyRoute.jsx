import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export default function PublicOnlyRoute({ children }) {
  const { user, token } = useAppStore();
  const location = useLocation();

  if (token && user) {
    const destination = user.role === "recruiter" ? "/dashboard" : "/";

    return (
      <Navigate to={destination} replace state={{ from: location.pathname }} />
    );
  }

  return children;
}
