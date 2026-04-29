import React, { useState } from "react";
import axios from "axios";

/**
 * AddVideoModal
 * Props:
 *   courseId  — e.g. "Maths", "English", "Hindi", "Science"
 *   onClose   — function to close the modal
 *   onAdded   — optional callback after successful add
 */
function AddVideoModal({ courseId, onClose, onAdded }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
    duration: "",
    sequenceNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Video title is required.");
      return;
    }
    if (!form.videoUrl.trim()) {
      setError("Video URL is required.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/videos/add", {
        ...form,
        courseId,
        duration: Number(form.duration) || 0,
        sequenceNumber: Number(form.sequenceNumber) || 0,
      });
      setSuccess(true);
      if (onAdded) onAdded();
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add video. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, #1e1e2e 0%, #16213e 100%)",
          borderRadius: "16px",
          padding: "2rem",
          width: "90%",
          maxWidth: "480px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          border: "1px solid rgba(99,179,237,0.2)",
          color: "#e2e8f0",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#63b3ed" }}>
              ➕ Add Video
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "#94a3b8" }}>
              Course: <strong style={{ color: "#f6ad55" }}>{courseId}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "none", color: "#94a3b8",
              borderRadius: "8px", width: "32px", height: "32px",
              cursor: "pointer", fontSize: "1.1rem", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        {success ? (
          <div style={{
            textAlign: "center", padding: "2rem 0",
            color: "#68d391", fontSize: "1.2rem", fontWeight: 600,
          }}>
            ✅ Video added successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {[
              { label: "Video Title *", name: "title", placeholder: "e.g. Lecture 1 - Introduction", type: "text" },
              { label: "Video URL *", name: "videoUrl", placeholder: "https://... or local path", type: "text" },
              { label: "Description", name: "description", placeholder: "Short description of the video", type: "text" },
              { label: "Thumbnail URL", name: "thumbnail", placeholder: "https://...", type: "text" },
              { label: "Duration (seconds)", name: "duration", placeholder: "e.g. 300 for 5 min", type: "number" },
              { label: "Sequence / Order No.", name: "sequenceNumber", placeholder: "e.g. 1, 2, 3...", type: "number" },
            ].map((field) => (
              <div key={field.name} style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94a3b8", marginBottom: "4px", fontWeight: 500 }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(99,179,237,0.2)",
                    borderRadius: "8px",
                    padding: "0.6rem 0.8rem",
                    color: "#e2e8f0",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}

            {error && (
              <p style={{ color: "#fc8181", fontSize: "0.85rem", marginBottom: "1rem" }}>
                ⚠️ {error}
              </p>
            )}

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1, padding: "0.7rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px", color: "#94a3b8",
                  cursor: "pointer", fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 2, padding: "0.7rem",
                  background: loading ? "#2d3748" : "linear-gradient(90deg, #63b3ed, #4299e1)",
                  border: "none", borderRadius: "8px",
                  color: "#fff", cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 600, fontSize: "0.95rem",
                  transition: "opacity 0.2s",
                }}
              >
                {loading ? "Saving..." : "💾 Save to MongoDB"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddVideoModal;
