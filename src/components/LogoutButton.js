import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LogoutButton() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const success = await logout();
    setIsLoading(false);
    
    if (success) {
      navigate("/login");
    }
  };

  // Only show if user is authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 hidden sm:inline">
        Welcome, <span className="font-semibold">{user.displayName || user.email.split('@')[0]}</span>
      </span>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition duration-200 text-sm"
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
