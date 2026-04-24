import Header from './../MyComponents/Header';       
import Doughnut from './../MyComponents/Chart';  
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebase";
import { useSpeechSynthesis } from "react-speech-kit";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [activeTab, setActiveTab] = useState("basic");
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const { speak } = useSpeechSynthesis();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const storedPreferences = localStorage.getItem("userPreferences");
    if (storedPreferences) {
      try {
        const prefs = JSON.parse(storedPreferences);
        setPreferences(prefs);
        setEditValues(prefs);
      } catch (e) {
        console.error("Error parsing user preferences", e);
      }
    }

    return () => unsubscribe();
  }, []);

  const handleEditField = (field) => {
    setEditingField(field);
    speak({ text: `Editing ${field}` });
  };

  const handleSaveField = (field) => {
    const updatedPreferences = {
      ...preferences,
      [field]: editValues[field]
    };
    setPreferences(updatedPreferences);
    localStorage.setItem("userPreferences", JSON.stringify(updatedPreferences));
    setEditingField(null);
    setShowSuccessMsg(true);
    speak({ text: "Saved successfully" });
    setTimeout(() => setShowSuccessMsg(false), 2000);
  };

  const handleInputChange = (field, value) => {
    setEditValues({
      ...editValues,
      [field]: value
    });
  };

  const handleToggle = (field) => {
    const newValue = !preferences[field];
    const updatedPreferences = {
      ...preferences,
      [field]: newValue
    };
    setPreferences(updatedPreferences);
    setEditValues(updatedPreferences);
    localStorage.setItem("userPreferences", JSON.stringify(updatedPreferences));
    speak({ text: `${field} ${newValue ? 'enabled' : 'disabled'}` });
  };

  const TabButton = ({ tabId, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      onMouseOver={() => speak({ text: label })}
      className={`flex items-center gap-2 px-4 py-3 font-semibold rounded-lg transition ${
        activeTab === tabId
          ? preferences?.highContrast
            ? "bg-white text-black border-4 border-white"
            : "bg-indigo-600 text-white shadow-lg"
          : preferences?.highContrast
          ? "bg-gray-800 text-white border-2 border-white hover:bg-gray-700"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const EditableField = ({ label, field, type = "text", value, icon }) => (
    <div className={`p-4 rounded-lg border transition ${
      preferences?.highContrast
        ? "bg-gray-800 border-4 border-white text-white hover:bg-gray-700"
        : "bg-gray-50 border border-gray-200 text-gray-900 hover:border-indigo-400"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">{icon}</span>
          <div className="flex-1">
            <p className={`text-sm font-medium ${preferences?.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{label}</p>
            {editingField === field ? (
              type === "select" ? (
                <select
                  value={editValues[field] || value || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className={`w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 ${
                    preferences?.highContrast
                      ? "bg-black border-2 border-white text-white"
                      : "bg-white text-gray-900"
                  }`}
                >
                  {field === "disabilityType" && (
                    <>
                      <option value="none">None</option>
                      <option value="visual">Visual Impairment</option>
                      <option value="hearing">Hearing Impairment</option>
                      <option value="learning">Learning Disability</option>
                      <option value="physical">Physical Disability</option>
                      <option value="prefer_not_say">Prefer not to say</option>
                    </>
                  )}
                  {field === "learningStyle" && (
                    <>
                      <option value="audio">🔊 Audio</option>
                      <option value="visual">👁️ Visual</option>
                      <option value="text">📝 Text</option>
                    </>
                  )}
                  {field === "languagePreference" && (
                    <>
                      <option value="english">English 🇬🇧</option>
                      <option value="hindi">Hindi हिंदी 🇮🇳</option>
                    </>
                  )}
                  {field === "fontSize" && (
                    <>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </>
                  )}
                </select>
              ) : (
                <input
                  type={type}
                  value={editValues[field] || value || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className={`w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-600 ${
                    preferences?.highContrast
                      ? "bg-black border-2 border-white text-white"
                      : "bg-white text-gray-900"
                  }`}
                />
              )
            ) : (
              <p className={`text-lg font-semibold mt-1 ${preferences?.highContrast ? 'text-white' : 'text-gray-900'}`}>
                {typeof value === 'boolean' ? (value ? '✅ Enabled' : '❌ Disabled') : (value || 'Not set')}
              </p>
            )}
          </div>
        </div>
        {editingField === field ? (
          <button
            onClick={() => handleSaveField(field)}
            className={`ml-3 px-4 py-2 text-white rounded-lg transition ${
              preferences?.highContrast
                ? "bg-green-700 border-2 border-white hover:bg-green-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
            onMouseOver={() => speak({ text: "Save changes" })}
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => handleEditField(field)}
            className={`ml-3 px-4 py-2 text-white rounded-lg transition ${
              preferences?.highContrast
                ? "bg-indigo-700 border-2 border-white hover:bg-indigo-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            onMouseOver={() => speak({ text: `Edit ${label}` })}
          >
            ✏️ Edit
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div 
        className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          preferences?.highContrast
            ? "bg-black text-white"
            : "bg-gradient-to-br from-blue-50 to-indigo-100"
        }`}
        style={{
          fontSize: preferences?.fontSize === "small" ? "14px" : preferences?.fontSize === "large" ? "18px" : "16px",
          fontFamily: preferences?.dyslexiaFont ? "'Comic Sans MS', cursive, sans-serif" : "inherit",
        }}
      >
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className={`${preferences?.highContrast ? 'bg-black border-4 border-white text-white' : 'bg-white text-gray-900'} rounded-lg shadow-lg p-8 mb-8`}>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl">
                👤
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {preferences?.fullName || user?.displayName || "User Profile"}
                </h1>
                <p className="text-gray-600 mt-1">{user?.email || "Email not available"}</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {showSuccessMsg && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              preferences?.highContrast
                ? "bg-black border-4 border-green-500 text-green-400"
                : "bg-green-100 border border-green-400 text-green-700"
            }`}>
              <span>✅</span>
              <span>Changes saved successfully!</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className={`flex flex-wrap gap-2 mb-8 p-4 rounded-lg shadow ${
            preferences?.highContrast
              ? "bg-black border-4 border-white"
              : "bg-white"
          }`}>
            <TabButton tabId="basic" label="Basic Details" icon="📋" />
            <TabButton tabId="accessibility" label="Accessibility" icon="♿" />
            <TabButton tabId="learning" label="Learning" icon="🧠" />
            <TabButton tabId="settings" label="Settings" icon="⚙️" />
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            
            {/* BASIC DETAILS */}
            {activeTab === "basic" && (
              <div className={`rounded-lg shadow-lg p-8 ${
                preferences?.highContrast
                  ? "bg-black border-4 border-white text-white"
                  : "bg-white text-gray-900"
              }`}>
                <h2 className="text-2xl font-bold mb-6">📋 Basic Details</h2>
                <div className="space-y-4">
                  <EditableField
                    label="Full Name"
                    field="fullName"
                    value={preferences?.fullName}
                    icon="👤"
                  />
                  <EditableField
                    label="Email Address"
                    field="email"
                    type="email"
                    value={preferences?.email || user?.email}
                    icon="📧"
                  />
                  <EditableField
                    label="Phone Number"
                    field="phoneNumber"
                    type="tel"
                    value={preferences?.phoneNumber}
                    icon="📱"
                  />
                  
                  {/* Activity Chart */}
                  <div className={`mt-8 pt-6 border-t ${preferences?.highContrast ? 'border-gray-600' : 'border-gray-200'}`}>
                    <h3 className={`text-xl font-bold mb-4 ${preferences?.highContrast ? 'text-white' : 'text-gray-800'}`}>📊 Your Activity</h3>
                    <div className={`p-6 rounded-lg flex justify-center ${
                      preferences?.highContrast
                        ? "bg-gray-800"
                        : "bg-gray-50"
                    }`}>
                      <Doughnut />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ACCESSIBILITY & SPECIAL NEEDS */}
            {activeTab === "accessibility" && (
              <div className={`rounded-lg shadow-lg p-8 ${
                preferences?.highContrast
                  ? "bg-black border-4 border-white text-white"
                  : "bg-white text-gray-900"
              }`}>
                <h2 className="text-2xl font-bold mb-6">♿ Accessibility & Special Needs</h2>
                <div className="space-y-4">
                  <EditableField
                    label="Type of Disability"
                    field="disabilityType"
                    type="select"
                    value={preferences?.disabilityType || "none"}
                    icon="♿"
                  />
                  
                  {/* Special Assistance Checkbox */}
                  <div className={`p-4 rounded-lg border transition ${
                    preferences?.highContrast
                      ? "bg-gray-800 border-2 border-white text-white hover:bg-gray-700"
                      : "bg-gray-50 border-gray-200 hover:border-indigo-400"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🆘</span>
                        <div>
                          <p className={`font-medium ${preferences?.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>Special Assistance Required</p>
                          <p className={`text-lg font-semibold ${preferences?.highContrast ? 'text-white' : 'text-gray-900'}`}>
                            {preferences?.needsSpecialAssistance ? '✅ Yes' : '❌ No'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle("needsSpecialAssistance")}
                        className={`px-4 py-2 rounded-lg transition ${
                          preferences?.needsSpecialAssistance
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                        onMouseOver={() => speak({ text: "Toggle special assistance" })}
                      >
                        {preferences?.needsSpecialAssistance ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* LEARNING PREFERENCES */}
            {activeTab === "learning" && (
              <div className={`rounded-lg shadow-lg p-8 ${
                preferences?.highContrast
                  ? "bg-black border-4 border-white text-white"
                  : "bg-white text-gray-900"
              }`}>
                <h2 className="text-2xl font-bold mb-6">🧠 Learning Preferences</h2>
                <div className="space-y-4">
                  <EditableField
                    label="Learning Style"
                    field="learningStyle"
                    type="select"
                    value={preferences?.learningStyle || "visual"}
                    icon="🧠"
                  />
                  <EditableField
                    label="Language Preference"
                    field="languagePreference"
                    type="select"
                    value={preferences?.languagePreference || "english"}
                    icon="🌐"
                  />
                </div>
              </div>
            )}

            {/* ACCESSIBILITY SETTINGS */}
            {activeTab === "settings" && (
              <div className={`rounded-lg shadow-lg p-8 ${
                preferences?.highContrast
                  ? "bg-black border-4 border-white text-white"
                  : "bg-white text-gray-900"
              }`}>
                <h2 className="text-2xl font-bold mb-6">⚙️ Accessibility Settings</h2>
                <div className="space-y-4">
                  
                  {/* Accessibility Mode Toggle */}
                  <div className={`p-4 rounded-lg border ${
                    preferences?.highContrast
                      ? "bg-gray-800 border-2 border-white text-white"
                      : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">♿</span>
                        <div>
                          <p className={`font-medium ${preferences?.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>Accessibility Mode</p>
                          <p className={`text-lg font-semibold ${preferences?.highContrast ? 'text-white' : 'text-gray-900'}`}>
                            {preferences?.accessibilityMode ? '✅ Enabled' : '❌ Disabled'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle("accessibilityMode")}
                        className={`px-4 py-2 rounded-lg transition ${
                          preferences?.accessibilityMode
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                        onMouseOver={() => speak({ text: "Toggle accessibility mode" })}
                      >
                        {preferences?.accessibilityMode ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <EditableField
                    label="Font Size"
                    field="fontSize"
                    type="select"
                    value={preferences?.fontSize || "medium"}
                    icon="🔤"
                  />

                  {/* Dyslexia Font Toggle */}
                  <div className={`p-4 rounded-lg border ${
                    preferences?.highContrast
                      ? "bg-gray-800 border-2 border-white text-white"
                      : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📖</span>
                        <div>
                          <p className={`font-medium ${preferences?.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>Dyslexia-Friendly Font</p>
                          <p className={`text-lg font-semibold ${preferences?.highContrast ? 'text-white' : 'text-gray-900'}`}>
                            {preferences?.dyslexiaFont ? '✅ Enabled' : '❌ Disabled'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle("dyslexiaFont")}
                        className={`px-4 py-2 rounded-lg transition ${
                          preferences?.dyslexiaFont
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                        onMouseOver={() => speak({ text: "Toggle dyslexia friendly font" })}
                      >
                        {preferences?.dyslexiaFont ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>

                  {/* High Contrast Toggle */}
                  <div className={`p-4 rounded-lg border ${
                    preferences?.highContrast
                      ? "bg-gray-800 border-2 border-white text-white"
                      : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⚫⚪</span>
                        <div>
                          <p className={`font-medium ${preferences?.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>High Contrast Mode</p>
                          <p className={`text-lg font-semibold ${preferences?.highContrast ? 'text-white' : 'text-gray-900'}`}>
                            {preferences?.highContrast ? '✅ Enabled' : '❌ Disabled'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle("highContrast")}
                        className={`px-4 py-2 rounded-lg transition ${
                          preferences?.highContrast
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                        onMouseOver={() => speak({ text: "Toggle high contrast mode" })}
                      >
                        {preferences?.highContrast ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>

                  {/* Text-to-Speech Toggle */}
                  <div className={`p-4 rounded-lg border ${
                    preferences?.highContrast
                      ? "bg-gray-800 border-2 border-white text-white"
                      : "bg-gray-50 border-gray-200"
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🔊</span>
                        <div>
                          <p className={`font-medium ${preferences?.highContrast ? 'text-gray-300' : 'text-gray-600'}`}>Text-to-Speech</p>
                          <p className={`text-lg font-semibold ${preferences?.highContrast ? 'text-white' : 'text-gray-900'}`}>
                            {preferences?.textToSpeech ? '✅ Enabled' : '❌ Disabled'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggle("textToSpeech")}
                        className={`px-4 py-2 rounded-lg transition ${
                          preferences?.textToSpeech
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white"
                        }`}
                        onMouseOver={() => speak({ text: "Toggle text to speech" })}
                      >
                        {preferences?.textToSpeech ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}