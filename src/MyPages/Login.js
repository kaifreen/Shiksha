import React, { useState, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import app from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import logo from "./../images/bluelogo.png";
import Navbar from "../MyComponents/Header";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function LoginPage() {
  const auth = getAuth(app);
  const { speak } = useSpeechSynthesis();
  const { getSignupSuccess } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const emailLabel = "Enter your email address";
  const passwordLabel = "Enter your password";
  const signInLabel = "Sign in to your account";

  // Check for signup success message
  useEffect(() => {
    const message = getSignupSuccess();
    if (message) {
      setSuccessMessage(message);
      speak({ text: message });
      // Clear success message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [getSignupSuccess, speak]);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/user-not-found":
        return "No account found with this email. Please sign up first.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/invalid-email":
        return "Invalid email address. Please check and try again.";
      case "auth/user-disabled":
        return "This account has been disabled. Please contact support.";
      case "auth/too-many-requests":
        return "Too many login attempts. Please try again later.";
      default:
        return errorCode.replace("auth/", "").replace(/-/g, " ");
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim()) {
      const msg = "Please enter your email address";
      setError(msg);
      speak({ text: msg });
      return;
    }

    if (!password.trim()) {
      const msg = "Please enter your password";
      setError(msg);
      speak({ text: msg });
      return;
    }

    setLoading(true);
    setError("");

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Sync user to MongoDB
        axios.post("http://localhost:5000/api/users/save", {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || "User"
        }).then(() => {
          setLoading(false);
          const successMsg = "Successfully signed in! Redirecting to dashboard...";
          speak({ text: successMsg });
          setTimeout(() => navigate("/home"), 500);
        }).catch((dbError) => {
          console.error("MongoDB sync failed on login:", dbError);
          // Still log them in if DB sync fails
          setLoading(false);
          const successMsg = "Successfully signed in! Redirecting to dashboard...";
          speak({ text: successMsg });
          setTimeout(() => navigate("/home"), 500);
        });
      })
      .catch((error) => {
        setLoading(false);
        const errorMsg = getErrorMessage(error.code);
        setError(errorMsg);
        speak({ text: errorMsg });
      });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <img
                className="h-16 w-auto"
                src={logo}
                alt="Shiksha Logo"
                onMouseOver={() => speak({ text: "Shiksha Logo" })}
              />
            </div>

            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 text-sm">
                Sign in to access your learning dashboard
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="block sm:inline">{successMessage}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="block sm:inline">{error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onMouseOver={() => speak({ text: emailLabel })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onMouseOver={() => speak({ text: passwordLabel })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseOver={() => speak({ text: showPassword ? "Hide password" : "Show password" })}
                    className="absolute right-3 top-3 text-gray-600"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                onMouseOver={() => speak({ text: signInLabel })}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <Link
              to="/signup"
              className="w-full bg-white border-2 border-indigo-600 hover:bg-indigo-50 text-indigo-600 font-semibold py-2 px-4 rounded-lg transition duration-200 text-center block"
            >
              Create Account
            </Link>

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 space-y-1">
              <p>
                <button className="text-indigo-600 hover:text-indigo-700 bg-none border-none cursor-pointer">
                  Forgot password?
                </button>
              </p>
              <p className="text-gray-400">© 2026 Shiksha. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
