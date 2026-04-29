import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import vol from "./../images/volume.png";
import profile from "./../images/profile.png";
import { useSpeechSynthesis } from "react-speech-kit";
import AddCourseModal from "./AddCourseModal";
import axios from "axios";

const API = "http://localhost:5000/api";

const SUBJECT_TO_COURSEID = {
  Mathematics: "Maths",
  Science: "Science",
  English: "English",
  Hindi: "Hindi",
};

const subjectLink = (subject) =>
  `/videos?subject=${SUBJECT_TO_COURSEID[subject] || subject}`;

/* ─────────────────────────────────────────────
   Global styles injected once
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.45; }
  }

  .shiksha-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 1.5rem;
    padding: 1.25rem 0 2rem;
  }

  .course-card {
    display: flex;
    flex-direction: column;
    border-radius: 16px;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid rgba(66,153,225,0.14);
    box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    transition: transform 0.22s ease, box-shadow 0.22s ease;
    font-family: 'Inter', sans-serif;
  }

  .course-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 36px rgba(66,153,225,0.18);
  }

  .course-card__img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    display: block;
    flex-shrink: 0;
  }

  .course-card__body {
    display: flex;
    flex-direction: column;
    flex: 1;                /* makes all card bodies grow equally */
    padding: 1rem 1.1rem;
    background: #f0f9ff;
    gap: 0;
  }

  .course-card__subject-badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 20px;
    background: #bee3f8;
    color: #2b6cb0;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
    width: fit-content;
  }

  .course-card__title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 6px;
    margin-bottom: 6px;
  }

  .course-card__title {
    font-size: 0.97rem;
    font-weight: 700;
    color: #1e3a5f;
    line-height: 1.35;
    margin: 0;
    /* clamp to 2 lines */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .course-card__tts-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px;
    flex-shrink: 0;
    opacity: 0.7;
    transition: opacity 0.15s;
  }
  .course-card__tts-btn:hover { opacity: 1; }

  .course-card__desc {
    font-size: 0.77rem;
    color: #64748b;
    line-height: 1.45;
    margin: 0 0 8px;
    /* clamp to 2 lines */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .course-card__stars {
    display: flex;
    align-items: center;
    gap: 3px;
    margin-bottom: 8px;
  }

  .course-card__star {
    font-size: 1.05rem;
    cursor: pointer;
    transition: color 0.13s, transform 0.12s;
    display: inline-block;
  }
  .course-card__star:hover { transform: scale(1.3); }
  .course-card__star--done { cursor: default !important; }

  .course-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }

  .badge-pill {
    border-radius: 20px;
    padding: 2px 9px;
    font-size: 0.69rem;
    font-weight: 600;
    white-space: nowrap;
  }
  .badge-purple { background: #e9d8fd; color: #553c9a; }
  .badge-yellow { background: #fefcbf; color: #744210; }
  .badge-green  { background: #c6f6d5; color: #276749; }

  .course-card__instructor {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 0.79rem;
    color: #4a5568;
    font-weight: 500;
    /* push to bottom via flex spacer above */
    margin-top: auto;
    padding-top: 8px;
    margin-bottom: 10px;
  }

  .course-card__instructor img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 1.5px solid #bee3f8;
  }

  .course-card__enroll-btn {
    display: block;
    text-align: center;
    text-decoration: none;
    background: linear-gradient(90deg, #4299e1, #3182ce);
    color: #fff !important;
    border: none;
    border-radius: 9px;
    font-weight: 700;
    font-size: 0.875rem;
    padding: 0.55rem 1rem;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 3px 10px rgba(66,153,225,0.3);
    /* always sits at bottom because card__body uses flex-col */
    flex-shrink: 0;
  }
  .course-card__enroll-btn:hover {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(66,153,225,0.4);
  }

  /* ── Skeleton ── */
  .skeleton-card {
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  .skeleton-block {
    background: #e2e8f0;
    border-radius: 6px;
    animation: pulse 1.4s ease-in-out infinite;
  }

  /* ── Header ── */
  .catalogue-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1.5rem 0 0.85rem;
    border-bottom: 2px solid rgba(66,153,225,0.14);
    margin-bottom: 0.25rem;
    font-family: 'Inter', sans-serif;
  }

  .add-course-btn {
    background: linear-gradient(90deg, #4299e1, #805ad5);
    border: none;
    border-radius: 12px;
    color: #fff;
    padding: 0.65rem 1.4rem;
    font-weight: 700;
    font-size: 0.92rem;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(66,153,225,0.32);
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: transform 0.15s, box-shadow 0.15s;
    font-family: 'Inter', sans-serif;
  }
  .add-course-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 22px rgba(66,153,225,0.42);
  }

  /* ── Toast ── */
  .catalogue-toast {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1.2rem;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.88rem;
    margin-bottom: 0.75rem;
    font-family: 'Inter', sans-serif;
    animation: slideIn 0.3s ease;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive tweaks ── */
  @media (max-width: 640px) {
    .shiksha-grid {
      grid-template-columns: 1fr;
    }
    .catalogue-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .shiksha-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;

/* ─────────────────────────────────────────────
   StarRating
───────────────────────────────────────────── */
function StarRating({ courseId, initialRating = 0, ratingCount = 0, onRate }) {
  const [hovered, setHovered]   = useState(0);
  const [selected, setSelected] = useState(0);
  const [done, setDone]         = useState(false);

  const display = hovered || selected || initialRating;

  const handleClick = (star) => {
    if (done) return;
    setSelected(star);
    setDone(true);
    if (onRate) onRate(courseId, star);
  };

  return (
    <div className="course-card__stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`course-card__star${done ? " course-card__star--done" : ""}`}
          onMouseEnter={() => !done && setHovered(star)}
          onMouseLeave={() => !done && setHovered(0)}
          onClick={() => handleClick(star)}
          style={{ color: star <= display ? "#f6ad55" : "#cbd5e0" }}
        >★</span>
      ))}
      <span style={{ fontSize: "0.72rem", color: "#64748b", marginLeft: "5px" }}>
        {(selected || initialRating) > 0
          ? `${Number(selected || initialRating).toFixed(1)}/5`
          : "Rate"}
        {ratingCount > 0 && (
          <span style={{ color: "#94a3b8", marginLeft: "4px" }}>({ratingCount})</span>
        )}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SkeletonCard
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-block" style={{ height: "150px", borderRadius: 0 }} />
      <div style={{ padding: "1rem 1.1rem" }}>
        <div className="skeleton-block" style={{ height: "11px", width: "35%", marginBottom: "12px" }} />
        <div className="skeleton-block" style={{ height: "14px", width: "85%", marginBottom: "8px" }} />
        <div className="skeleton-block" style={{ height: "14px", width: "65%", marginBottom: "14px" }} />
        <div className="skeleton-block" style={{ height: "11px", width: "90%", marginBottom: "6px" }} />
        <div className="skeleton-block" style={{ height: "11px", width: "75%", marginBottom: "16px" }} />
        <div className="skeleton-block" style={{ height: "36px", width: "100%", borderRadius: "9px" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Catalogue (main)
───────────────────────────────────────────── */
function Catalogue() {
  const { speak } = useSpeechSynthesis();

  const [courses, setCourses]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [enrolling, setEnrolling]         = useState({});
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [toast, setToast]                 = useState(null); // { msg, type }

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* fetch all courses from MongoDB */
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/courses`);
      setCourses(res.data);
    } catch {
      showToast("⚠️ Could not load courses. Is the server running?", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  /* enroll */
  const handleEnroll = async (course) => {
    const id = course._id;
    setEnrolling((p) => ({ ...p, [id]: true }));
    try {
      const res = await axios.post(`${API}/courses/enroll`, { subject: course.subject });
      setCourses((prev) =>
        prev.map((c) => c._id === id ? { ...c, enrolledCount: res.data.enrolledCount } : c)
      );
    } catch { /* silent */ } finally {
      setEnrolling((p) => ({ ...p, [id]: false }));
    }
  };

  /* rate */
  const handleRate = async (courseId, rating) => {
    const course = courses.find((c) => c._id === courseId);
    if (!course) return;
    try {
      const res = await axios.post(`${API}/courses/rate`, { subject: course.subject, rating });
      setCourses((prev) =>
        prev.map((c) =>
          c._id === courseId
            ? { ...c, rating: res.data.rating, ratingCount: res.data.ratingCount }
            : c
        )
      );
    } catch { /* silent */ }
  };

  const handleCourseAdded = () => {
    showToast("✅ Course saved to MongoDB successfully!");
    fetchCourses();
  };

  /* ── render ── */
  return (
    <div style={{ padding: "0 1.25rem 2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <style>{GLOBAL_CSS}</style>

      {/* Header */}
      <div className="catalogue-header">
        <div>
          <h4 style={{ margin: 0, fontWeight: 700, color: "#1e293b", fontSize: "1.45rem", fontFamily: "Inter,sans-serif" }}>
            📚 Course Catalogue
          </h4>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "0.84rem", fontFamily: "Inter,sans-serif" }}>
            {loading
              ? "Loading courses from MongoDB…"
              : `${courses.length} course${courses.length !== 1 ? "s" : ""} available`}
          </p>
        </div>
        <button className="add-course-btn" onClick={() => setShowAddCourse(true)}>
          ➕ Add Course
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="catalogue-toast"
          style={{
            background: toast.type === "error"
              ? "linear-gradient(90deg,#e53e3e,#c53030)"
              : "linear-gradient(90deg,#38a169,#2f855a)",
            color: "#fff",
            boxShadow: toast.type === "error"
              ? "0 4px 14px rgba(229,62,62,0.3)"
              : "0 4px 14px rgba(56,161,105,0.3)",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Grid */}
      <div className="shiksha-grid">

        {/* Skeletons */}
        {loading && [1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}

        {/* Course cards */}
        {!loading && courses.map((course) => (
          <div className="course-card" key={course._id}>

            {/* Thumbnail */}
            <img
              className="course-card__img"
              src={course.thumbnail || "/evs.png"}
              alt={course.title}
              onError={(e) => { e.target.src = "/evs.png"; }}
            />

            {/* Body */}
            <div className="course-card__body">

              {/* Subject badge */}
              <span className="course-card__subject-badge">{course.subject}</span>

              {/* Title + TTS */}
              <div className="course-card__title-row">
                <h5 className="course-card__title">{course.title}</h5>
                <button
                  className="course-card__tts-btn"
                  onClick={() => speak({ text: `${course.title}. ${course.description || ""}` })}
                  title="Read aloud"
                >
                  <img src={vol} alt="tts" style={{ width: "18px" }} />
                </button>
              </div>

              {/* Description — max 2 lines with ellipsis */}
              {course.description && (
                <p className="course-card__desc">{course.description}</p>
              )}

              {/* Star rating */}
              <StarRating
                courseId={course._id}
                initialRating={course.rating || 0}
                ratingCount={course.ratingCount || 0}
                onRate={handleRate}
              />



              {/* Instructor — margin-top:auto pushes it down */}
              <div className="course-card__instructor">
                {course.instructorImg ? (
                  <img
                    src={course.instructorImg}
                    alt={course.instructor}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <img src={profile} alt="" />
                )}
                <span>{course.instructor || "Instructor"}</span>
              </div>

              {/* Enroll button — always at bottom */}
              <Link
                to={subjectLink(course.subject)}
                className="course-card__enroll-btn"
                style={{ opacity: enrolling[course._id] ? 0.7 : 1 }}
                onClick={() => handleEnroll(course)}
              >
                {enrolling[course._id] ? "Enrolling…" : "Enroll →"}
              </Link>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {!loading && courses.length === 0 && (
          <div style={{
            gridColumn: "1/-1", textAlign: "center",
            padding: "3.5rem 1rem", color: "#64748b",
            fontFamily: "Inter,sans-serif",
          }}>
            <p style={{ fontSize: "3rem", margin: "0 0 0.5rem" }}>📭</p>
            <p style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 0.4rem" }}>
              No courses found in MongoDB
            </p>
            <p style={{ fontSize: "0.84rem" }}>
              Click <strong>➕ Add Course</strong> or run{" "}
              <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                node server/seedCatalogue.js
              </code>
            </p>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddCourse && (
        <AddCourseModal
          onClose={() => setShowAddCourse(false)}
          onAdded={handleCourseAdded}
        />
      )}
    </div>
  );
}

export default Catalogue;
