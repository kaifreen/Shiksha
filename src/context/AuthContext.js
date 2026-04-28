import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import axios from "axios";
import app from "../firebase";

const AuthContext = createContext();
const API_URL = "http://localhost:5000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth(app);

  // Save user to MongoDB
  const saveUserToMongo = async (userData) => {
    try {
      await axios.post(`${API_URL}/users/save`, userData);
      console.log("✅ User saved to MongoDB");
    } catch (error) {
      console.error("❌ Error saving user to MongoDB:", error);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        const userData = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || currentUser.email.split('@')[0],
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Save user to MongoDB
        saveUserToMongo(userData);
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("signupSuccess");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Set signup success message
  const setSignupSuccess = (message) => {
    localStorage.setItem("signupSuccess", message);
  };

  // Get and clear signup success message
  const getSignupSuccess = () => {
    const message = localStorage.getItem("signupSuccess");
    localStorage.removeItem("signupSuccess");
    return message;
  };

  const value = {
    user,
    loading,
    error,
    logout,
    setSignupSuccess,
    getSignupSuccess,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
