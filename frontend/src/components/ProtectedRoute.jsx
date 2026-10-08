import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAppStore } from "../store/useAppStore";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, token } = useAppStore();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] bg-slate-900 flex flex-col justify-center items-center px-4 text-slate-100">
        <ShieldAlert className="h-14 w-14 text-rose-500 mb-4" />

        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>

        <p className="text-slate-400 text-sm text-center max-w-md mb-6">
          You do not have permission to access this section.
        </p>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return children;
}
