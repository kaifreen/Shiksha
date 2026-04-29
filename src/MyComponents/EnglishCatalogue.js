import React, { useState } from "react";
import { Link } from "react-router-dom";
import vol from "./../images/volume.png";
import profile from "./../images/profile.png";
import { useSpeechSynthesis } from "react-speech-kit";
import AddVideoModal from "./AddVideoModal";

function EnglishCatalogue() {
  const { speak } = useSpeechSynthesis();
  const eng = "English. It contains 10 story telling lectures and 5 quizes";

  const [showAddVideo, setShowAddVideo] = useState(false);
  const [addCourseId, setAddCourseId] = useState("");

  const openAddVideo = (courseId) => {
    setAddCourseId(courseId);
    setShowAddVideo(true);
  };

  return (
    <div className="m-3">
      {/* CARD IMAGE DIM.: 1163 x 1206 */}
      <div className="d-flex flex-wrap gap-5 pt-5">

        {/* Card 1 */}
        <div className="card" style={{ width: "18rem" }}>
          <img src="/eng.jpg" className="card-img-top" alt="English" />
          <div className="card-body text-gray-500 font-semibold bg-sky-200">
            <h5 className="card-title fs-4">English</h5>
            <button onClick={() => speak({ text: eng })}>
              <img src={vol} alt="volume" />
            </button>
            <p className="card-text p-2">10 lessons • 5 quizes</p>
            <p className="card-text p-2">
              <img className="h-30 w-10 rounded-full" src={profile} alt="" />
              Shams Tabrez
            </p>
            <div className="d-flex gap-2 mt-2">
              <a href="videos" className="btn btn-outline-primary">
                <Link to="/videos?subject=English" className="nav-link active">Enroll</Link>
              </a>
              <button
                className="btn btn-success btn-sm"
                onClick={() => openAddVideo("English")}
              >
                ➕ Add Video
              </button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card" style={{ width: "18rem" }}>
          <img src="/enggram.jpg" className="card-img-top" alt="English Grammar" />
          <div className="card-body text-gray-500 font-semibold bg-sky-200">
            <h5 className="card-title fs-4">English Grammar</h5>
            <button onClick={() => speak({ text: eng })}>
              <img src={vol} alt="volume" />
            </button>
            <p className="card-text p-2">10 lessons • 5 quizes</p>
            <p className="card-text p-2">
              <img className="h-30 w-10 rounded-full" src={profile} alt="" />
              Shams Tabrez
            </p>
            <div className="d-flex gap-2 mt-2">
              <a href="videos" className="btn btn-outline-primary">
                <Link to="/videos?subject=English" className="nav-link active">Enroll</Link>
              </a>
              <button
                className="btn btn-success btn-sm"
                onClick={() => openAddVideo("English")}
              >
                ➕ Add Video
              </button>
            </div>
          </div>
        </div>

      </div>

      {showAddVideo && (
        <AddVideoModal
          courseId={addCourseId}
          onClose={() => setShowAddVideo(false)}
        />
      )}
    </div>
  );
}

export default EnglishCatalogue;
