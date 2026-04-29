import React, { useState } from "react";
import axios from "axios";

/**
 * AddCourseModal
 * Props:
 *   onClose  — closes the modal
 *   onAdded  — optional callback after successful save
 */
function AddCourseModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    title: "",
    subject: "Mathematics",
    description: "",
    instructor: "",
    thumbnail: "",
    level: "Beginner",
    duration: "",
    price: "",
    videoCount: "",
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
      setError("Course title is required.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/courses", {
        ...form,
        price: Number(form.price) || 0,
        videoCount: Number(form.videoCount) || 0,
      });
      setSuccess(true);
      if (onAdded) onAdded();
      setTimeout(() => onClose(), 1800);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add course. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── styles ── */
  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(99,179,237,0.25)",
    borderRadius: "8px",
    padding: "0.6rem 0.85rem",
    color: "#e2e8f0",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.78rem",
    color: "#94a3b8",
    marginBottom: "4px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  return (
    /* ── Backdrop ── */
    <div
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, padding: "1rem",
      }}
      onClick={onClose}
    >
      {/* ── Modal Card ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderRadius: "18px",
          padding: "2rem",
          width: "100%",
          maxWidth: "540px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          border: "1px solid rgba(99,179,237,0.18)",
          color: "#e2e8f0",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.6rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#63b3ed" }}>
              📚 Add New Course
            </h2>
            <p style={{ margin: "5px 0 0", fontSize: "0.82rem", color: "#64748b" }}>
              Saved permanently to MongoDB Atlas
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "none", color: "#94a3b8",
              borderRadius: "8px", width: "34px", height: "34px",
              cursor: "pointer", fontSize: "1rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >✕</button>
        </div>

        {/* ── Success State ── */}
        {success ? (
          <div style={{
            textAlign: "center", padding: "2.5rem 0",
            color: "#68d391", fontSize: "1.25rem", fontWeight: 600,
          }}>
            ✅ Course added successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {/* Row 1 — Title */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Course Title *</label>
              <input
                type="text" name="title" value={form.title}
                onChange={handleChange} placeholder="e.g. Basics of Mathematics"
                style={inputStyle}
              />
            </div>

            {/* Row 2 — Subject + Level side by side */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1rem" }}>
              <div>
                <label style={labelStyle}>Subject *</label>
                <select name="subject" value={form.subject} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Level</label>
                <select name="level" value={form.level} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Row 3 — Instructor */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Instructor Name</label>
              <input
                type="text" name="instructor" value={form.instructor}
                onChange={handleChange} placeholder="e.g. Sachin Bellani"
                style={inputStyle}
              />
            </div>

            {/* Row 4 — Description */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description" value={form.description}
                onChange={handleChange}
                placeholder="Brief course description..."
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>

            {/* Row 5 — Thumbnail */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Thumbnail URL</label>
              <input
                type="text" name="thumbnail" value={form.thumbnail}
                onChange={handleChange} placeholder="https://... or /public-image.png"
                style={inputStyle}
              />
            </div>

            {/* Row 6 — Duration + Video Count + Price */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem", marginBottom: "1rem" }}>
              <div>
                <label style={labelStyle}>Duration</label>
                <input
                  type="text" name="duration" value={form.duration}
                  onChange={handleChange} placeholder="e.g. 4h 30m"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>No. of Videos</label>
                <input
                  type="number" name="videoCount" value={form.videoCount}
                  onChange={handleChange} placeholder="e.g. 12"
                  style={inputStyle} min="0"
                />
              </div>
              <div>
                <label style={labelStyle}>Price (₹)</label>
                <input
                  type="number" name="price" value={form.price}
                  onChange={handleChange} placeholder="0 = Free"
                  style={inputStyle} min="0"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p style={{ color: "#fc8181", fontSize: "0.85rem", marginBottom: "1rem" }}>
                ⚠️ {error}
              </p>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                type="button" onClick={onClose}
                style={{
                  flex: 1, padding: "0.75rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px", color: "#94a3b8",
                  cursor: "pointer", fontWeight: 500, fontSize: "0.9rem",
                }}
              >
                Cancel
              </button>
              <button
                type="submit" disabled={loading}
                style={{
                  flex: 2, padding: "0.75rem",
                  background: loading
                    ? "#2d3748"
                    : "linear-gradient(90deg, #4299e1, #805ad5)",
                  border: "none", borderRadius: "10px",
                  color: "#fff", cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 700, fontSize: "0.95rem",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(66,153,225,0.35)",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "Saving..." : "💾 Save Course to MongoDB"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default AddCourseModal;
