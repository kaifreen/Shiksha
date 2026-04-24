import React, { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import app from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import logo from "./../images/bluelogo.png";
import Navbar from "../MyComponents/Header";
import { useAuth } from "../context/AuthContext";

function SignupPage() {
  const auth = getAuth(app);
  const { speak } = useSpeechSynthesis();
  const { setSignupSuccess } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Accessibility & Special Needs
  const [disabilityType, setDisabilityType] = useState("none");
  const [needsSpecialAssistance, setNeedsSpecialAssistance] = useState(false);
  
  // Learning Preferences
  const [learningStyle, setLearningStyle] = useState("visual");
  const [languagePreference, setLanguagePreference] = useState("english");
  
  // Accessibility Settings
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);
  
  // Agreements
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  
  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("basic");

  // Validation function
  const validateForm = () => {
    if (!fullName.trim()) {
      setError("Full name is required");
      speak({ text: "Full name is required" });
      return false;
    }

    if (!email.includes("@")) {
      setError("Valid email address is required");
      speak({ text: "Valid email address is required" });
      return false;
    }

    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      speak({ text: "Phone number is required" });
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      speak({ text: "Passwords do not match" });
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      speak({ text: "Password must be at least 6 characters" });
      return false;
    }

    if (!termsAccepted || !privacyAccepted) {
      setError("You must accept Terms & Conditions and Privacy Policy");
      speak({ text: "You must accept Terms and Conditions and Privacy Policy" });
      return false;
    }

    return true;
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Update user profile with display name
        updateProfile(userCredential.user, {
          displayName: fullName,
        }).then(() => {
          // Store user preferences
          const userPreferences = {
            fullName,
            phoneNumber,
            disabilityType,
            needsSpecialAssistance,
            learningStyle,
            languagePreference,
            accessibilityMode,
            fontSize,
            dyslexiaFont,
            highContrast,
            textToSpeech,
          };
          localStorage.setItem("userPreferences", JSON.stringify(userPreferences));

          setLoading(false);
          const successMsg = "✅ Account created successfully! Please sign in.";
          setSignupSuccess(successMsg);
          speak({ text: "Account created successfully! Please sign in." });
          setTimeout(() => navigate("/login"), 1000);
        }).catch((error) => {
          setLoading(false);
          setError("Failed to set up profile: " + error.message);
          speak({ text: "Failed to set up profile" });
        });
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
        speak({ text: error.message });
      });
  };

  return (
    <>
      <Navbar />
      <div 
        className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          highContrast 
            ? "bg-black text-white" 
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        }`}
        style={{
          fontSize: fontSize === "small" ? "14px" : fontSize === "large" ? "18px" : "16px",
          fontFamily: dyslexiaFont ? "dyslexia, sans-serif" : "inherit",
        }}
      >
        <div className="flex items-center justify-center px-4">
        <div className={`w-full max-w-2xl ${highContrast ? "bg-black border-4 border-white" : "bg-white rounded-lg shadow-xl"} p-8`}>
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              className="h-16 w-auto"
              src={logo}
              alt="Shiksha Logo"
              onMouseOver={() => speak({ text: "Shiksha Logo" })}
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold mb-2 ${highContrast ? "text-white" : "text-gray-900"}`}>
              Get Started with Shiksha
            </h2>
            <p className={`text-sm ${highContrast ? "text-gray-300" : "text-gray-600"}`}>
              Create your account and customize your learning experience
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 rounded border-2 ${
              highContrast 
                ? "bg-black text-white border-red-500" 
                : "bg-red-50 border-red-200 text-red-700"
            }`}>
              <span className="block">{error}</span>
            </div>
          )}

          {/* Section Navigation Tabs */}
          <div className="mb-8 flex flex-wrap gap-2 border-b">
            {[
              { id: "basic", label: "📋 Basic Details", icon: "🧾" },
              { id: "accessibility", label: "♿ Accessibility", icon: "♿" },
              { id: "learning", label: "🧠 Learning", icon: "🧠" },
              { id: "settings", label: "⚙️ Settings", icon: "⚙️" },
              { id: "agreements", label: "📜 Agreements", icon: "📜" },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                onMouseOver={() => speak({ text: section.label })}
                className={`px-4 py-2 text-sm font-medium rounded-t transition ${
                  activeSection === section.id
                    ? highContrast
                      ? "bg-white text-black border-b-4 border-white"
                      : "bg-indigo-600 text-white border-b-4 border-indigo-600"
                    : highContrast
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-6">
            
            {/* SECTION 1: BASIC DETAILS */}
            {activeSection === "basic" && (
              <div className="space-y-4">
                <h3 className={`text-xl font-bold mb-4 ${highContrast ? "text-white" : "text-gray-900"}`}>
                  🧾 Basic Details
                </h3>

                {/* Full Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${highContrast ? "text-white" : "text-gray-700"}`}>
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onMouseOver={() => speak({ text: "Enter your full name" })}
                    placeholder="John Doe"
                    className={`w-full px-4 py-2 rounded-lg outline-none transition ${
                      highContrast
                        ? "bg-gray-800 border-2 border-white text-white placeholder-gray-400"
                        : "border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    }`}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${highContrast ? "text-white" : "text-gray-700"}`}>
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onMouseOver={() => speak({ text: "Enter your email address" })}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-2 rounded-lg outline-none transition ${
                      highContrast
                        ? "bg-gray-800 border-2 border-white text-white placeholder-gray-400"
                        : "border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    }`}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${highContrast ? "text-white" : "text-gray-700"}`}>
                    Phone Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    onMouseOver={() => speak({ text: "Enter your phone number" })}
                    placeholder="+91 98765 43210"
                    className={`w-full px-4 py-2 rounded-lg outline-none transition ${
                      highContrast
                        ? "bg-gray-800 border-2 border-white text-white placeholder-gray-400"
                        : "border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    }`}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${highContrast ? "text-white" : "text-gray-700"}`}>
                    Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onMouseOver={() => speak({ text: "Create a strong password" })}
                      placeholder="••••••••"
                      className={`w-full px-4 py-2 rounded-lg outline-none transition pr-10 ${
                        highContrast
                          ? "bg-gray-800 border-2 border-white text-white placeholder-gray-400"
                          : "border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseOver={() => speak({ text: showPassword ? "Hide password" : "Show password" })}
                      className={`absolute right-3 top-3 ${highContrast ? "text-white" : "text-gray-600"}`}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  <p className={`mt-1 text-xs ${highContrast ? "text-gray-300" : "text-gray-500"}`}>
                    Must be at least 6 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${highContrast ? "text-white" : "text-gray-700"}`}>
                    Confirm Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onMouseOver={() => speak({ text: "Confirm your password" })}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 rounded-lg outline-none transition ${
                      highContrast
                        ? "bg-gray-800 border-2 border-white text-white placeholder-gray-400"
                        : "border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    }`}
                  />
                </div>
              </div>
            )}

            
            {/* SECTION 3: ACCESSIBILITY & SPECIAL NEEDS */}
            {activeSection === "accessibility" && (
              <div className="space-y-4">
                <h3 className={`text-xl font-bold mb-4 ${highContrast ? "text-white" : "text-gray-900"}`}>
                  ♿ Accessibility & Special Needs
                </h3>

                {/* Disability Type */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${highContrast ? "text-white" : "text-gray-700"}`}>
                    Type of Disability
                  </label>
                  <select
                    value={disabilityType}
                    onChange={(e) => setDisabilityType(e.target.value)}
                    onMouseOver={() => speak({ text: "Select disability type" })}
                    className={`w-full px-4 py-2 rounded-lg outline-none transition ${
                      highContrast
                        ? "bg-gray-800 border-2 border-white text-white"
                        : "border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    }`}
                  >
                    <option value="none">None</option>
                    <option value="visual">Visual Impairment</option>
                    <option value="hearing">Hearing Impairment</option>
                    <option value="learning">Learning Disability</option>
                    <option value="physical">Physical Disability</option>
                    <option value="prefer_not_say">Prefer not to say</option>
                  </select>
                </div>

                {/* Special Assistance Checkbox */}
                <div className="flex items-center">
                  <input
                    id="specialAssistance"
                    type="checkbox"
                    checked={needsSpecialAssistance}
                    onChange={(e) => setNeedsSpecialAssistance(e.target.checked)}
                    onMouseOver={() => speak({ text: "Need special assistance" })}
                    className="h-4 w-4 rounded"
                  />
                  <label htmlFor="specialAssistance" className={`ml-3 text-sm font-medium ${highContrast ? "text-white" : "text-gray-700"}`}>
                    I need special assistance
                  </label>
                </div>
              </div>
            )}

            {/* SECTION 4: LEARNING PREFERENCES */}
            {activeSection === "learning" && (
              <div className="space-y-4">
                <h3 className={`text-xl font-bold mb-4 ${highContrast ? "text-white" : "text-gray-900"}`}>
                  🧠 Learning Preferences
                </h3>

                {/* Learning Style */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${highContrast ? "text-white" : "text-gray-700"}`}>
                    Preferred Learning Style
                  </label>
                  <div className="space-y-2">
                    {["audio", "visual", "text"].map((style) => (
                      <div key={style} className="flex items-center">
                        <input
                          id={`style-${style}`}
                          type="radio"
                          name="learningStyle"
                          value={style}
                          checked={learningStyle === style}
                          onChange={(e) => setLearningStyle(e.target.value)}
                          onMouseOver={() => speak({ text: `${style} learning` })}
                          className="h-4 w-4"
                        />
                        <label htmlFor={`style-${style}`} className={`ml-3 text-sm font-medium ${highContrast ? "text-white" : "text-gray-700"}`}>
                          {style === "audio" && "🔊 Audio"}
                          {style === "visual" && "👁️ Visual"}
                          {style === "text" && "📝 Text"}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Language Preference */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${highContrast ? "text-white" : "text-gray-700"}`}>
                    Language Preference
                  </label>
                  <select
                    value={languagePreference}
                    onChange={(e) => setLanguagePreference(e.target.value)}
                    onMouseOver={() => speak({ text: "Select language preference" })}
                    className={`w-full px-4 py-2 rounded-lg outline-none transition ${
                      highContrast
                        ? "bg-gray-800 border-2 border-white text-white"
                        : "border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    }`}
                  >
                    <option value="english">English 🇬🇧</option>
                    <option value="hindi">Hindi हिंदी 🇮🇳</option>
                  </select>
                </div>
              </div>
            )}

            {/* SECTION 5: ACCESSIBILITY SETTINGS */}
            {activeSection === "settings" && (
              <div className="space-y-4">
                <h3 className={`text-xl font-bold mb-4 ${highContrast ? "text-white" : "text-gray-900"}`}>
                  ⚙️ Accessibility Settings
                </h3>

                {/* Enable Accessibility Mode */}
                <div className="flex items-center justify-between p-3 rounded border">
                  <label className={`text-sm font-medium ${highContrast ? "text-white" : "text-gray-700"}`}>
                    Enable Accessibility Mode
                  </label>
                  <button
                    type="button"
                    onClick={() => setAccessibilityMode(!accessibilityMode)}
                    onMouseOver={() => speak({ text: accessibilityMode ? "Disable accessibility mode" : "Enable accessibility mode" })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      accessibilityMode ? "bg-indigo-600" : highContrast ? "bg-gray-800" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        accessibilityMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Font Size */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${highContrast ? "text-white" : "text-gray-700"}`}>
                    Font Size
                  </label>
                  <div className="flex gap-3">
                    {["small", "medium", "large"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFontSize(size)}
                        onMouseOver={() => speak({ text: `${size} font size` })}
                        className={`px-4 py-2 rounded transition ${
                          fontSize === size
                            ? highContrast
                              ? "bg-white text-black border-2 border-white"
                              : "bg-indigo-600 text-white"
                            : highContrast
                            ? "bg-gray-800 text-white border-2 border-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {size === "small" && "A"}
                        {size === "medium" && "A+"}
                        {size === "large" && "A++"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dyslexia-Friendly Font */}
                <div className="flex items-center justify-between p-3 rounded border">
                  <label className={`text-sm font-medium ${highContrast ? "text-white" : "text-gray-700"}`}>
                    Dyslexia-Friendly Font
                  </label>
                  <button
                    type="button"
                    onClick={() => setDyslexiaFont(!dyslexiaFont)}
                    onMouseOver={() => speak({ text: dyslexiaFont ? "Disable dyslexia-friendly font" : "Enable dyslexia-friendly font" })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      dyslexiaFont ? "bg-indigo-600" : highContrast ? "bg-gray-800" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        dyslexiaFont ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* High Contrast Mode */}
                <div className="flex items-center justify-between p-3 rounded border">
                  <label className={`text-sm font-medium ${highContrast ? "text-white" : "text-gray-700"}`}>
                    High Contrast Mode
                  </label>
                  <button
                    type="button"
                    onClick={() => setHighContrast(!highContrast)}
                    onMouseOver={() => speak({ text: highContrast ? "Disable high contrast mode" : "Enable high contrast mode" })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      highContrast ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        highContrast ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Text-to-Speech */}
                <div className="flex items-center justify-between p-3 rounded border">
                  <label className={`text-sm font-medium ${highContrast ? "text-white" : "text-gray-700"}`}>
                    Text-to-Speech Enable
                  </label>
                  <button
                    type="button"
                    onClick={() => setTextToSpeech(!textToSpeech)}
                    onMouseOver={() => speak({ text: textToSpeech ? "Disable text to speech" : "Enable text to speech" })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      textToSpeech ? "bg-indigo-600" : highContrast ? "bg-gray-800" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        textToSpeech ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 6: AGREEMENTS */}
            {activeSection === "agreements" && (
              <div className="space-y-4">
                <h3 className={`text-xl font-bold mb-4 ${highContrast ? "text-white" : "text-gray-900"}`}>
                  📜 Agreements & Policies
                </h3>

                {/* Terms & Conditions */}
                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    onMouseOver={() => speak({ text: "Accept terms and conditions" })}
                    className="h-4 w-4 mt-1 rounded"
                  />
                  <label htmlFor="terms" className={`ml-3 text-sm ${highContrast ? "text-white" : "text-gray-700"}`}>
                    I agree to the{" "}
                    <a href="/terms" className={highContrast ? "text-white underline" : "text-indigo-600 hover:text-indigo-700"}>
                      Terms of Service
                    </a>{" "}
                    <span className="text-red-600">*</span>
                  </label>
                </div>

                {/* Privacy Policy */}
                <div className="flex items-start">
                  <input
                    id="privacy"
                    type="checkbox"
                    required
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    onMouseOver={() => speak({ text: "Accept privacy policy" })}
                    className="h-4 w-4 mt-1 rounded"
                  />
                  <label htmlFor="privacy" className={`ml-3 text-sm ${highContrast ? "text-white" : "text-gray-700"}`}>
                    I agree to the{" "}
                    <a href="/privacy" className={highContrast ? "text-white underline" : "text-indigo-600 hover:text-indigo-700"}>
                      Privacy Policy
                    </a>{" "}
                    <span className="text-red-600">*</span>
                  </label>
                </div>

                <div className={`p-3 rounded text-xs ${
                  highContrast
                    ? "bg-gray-800 text-gray-300 border border-white"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  <p className="font-semibold mb-2">🔒 Your Data Safety</p>
                  <p>We take your privacy seriously. Your data is encrypted and stored securely. You can read our full privacy policy for more details.</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  const sections = ["basic", "role", "accessibility", "learning", "settings", "agreements"];
                  const currentIndex = sections.indexOf(activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1]);
                  }
                }}
                className={`px-4 py-2 rounded-lg transition flex-1 ${
                  activeSection === "basic"
                    ? "opacity-50 cursor-not-allowed"
                    : highContrast
                    ? "bg-gray-800 text-white border-2 border-white hover:bg-gray-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                disabled={activeSection === "basic"}
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={() => {
                  const sections = ["basic", "role", "accessibility", "learning", "settings", "agreements"];
                  const currentIndex = sections.indexOf(activeSection);
                  if (currentIndex < sections.length - 1) {
                    setActiveSection(sections[currentIndex + 1]);
                  }
                }}
                className={`px-4 py-2 rounded-lg transition flex-1 ${
                  activeSection === "agreements"
                    ? "opacity-50 cursor-not-allowed"
                    : highContrast
                    ? "bg-gray-700 text-white border-2 border-white hover:bg-gray-600"
                    : "bg-gray-600 text-white hover:bg-gray-700"
                }`}
                disabled={activeSection === "agreements"}
              >
                Next →
              </button>

              {activeSection === "agreements" && (
                <button
                  type="submit"
                  disabled={loading}
                  onMouseOver={() => speak({ text: "Create your account" })}
                  className={`px-6 py-2 rounded-lg transition font-semibold flex-1 ${
                    highContrast
                      ? "bg-white text-black border-2 border-white hover:bg-gray-200 disabled:opacity-50"
                      : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "✨ Create Account"
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <div className={`mt-8 pt-6 border-t text-center ${highContrast ? "border-white" : "border-gray-200"}`}>
            <p className={`text-sm ${highContrast ? "text-gray-300" : "text-gray-600"}`}>
              Already have an account?{" "}
              <Link
                to="/login"
                onMouseOver={() => speak({ text: "Go to login page" })}
                className={`font-semibold transition ${
                  highContrast
                    ? "text-white hover:underline"
                    : "text-indigo-600 hover:text-indigo-700"
                }`}
              >
                Sign In here
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className={`text-center text-xs mt-6 ${highContrast ? "text-gray-400" : "text-gray-500"}`}>
            <p>© 2024 Shiksha. All rights reserved.</p>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default SignupPage;
