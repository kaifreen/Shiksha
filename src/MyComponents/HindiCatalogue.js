import React, { useState } from "react";
import { Link } from "react-router-dom";
import vol from "./../images/volume.png";
import profile from "./../images/profile.png";
import { useSpeechSynthesis } from "react-speech-kit";
import hin from "./../images/hin.png";
import AddVideoModal from "./AddVideoModal";

function HindiCatalogue() {
  const { speak } = useSpeechSynthesis();
  const hinText = "Hindi. It contains 10 lectures and 5 quizes";

  const [showAddVideo, setShowAddVideo] = useState(false);
  const [addCourseId, setAddCourseId] = useState("");

  const openAddVideo = (courseId) => {
    setAddCourseId(courseId);
    setShowAddVideo(true);
  };

  return (
    <div className="m-3">
      <div className="d-flex flex-wrap gap-5 pt-5">

        {/* Card 1 */}
        <div className="card" style={{ width: "18rem" }}>
          <img src={hin} className="card-img-top" alt="Hindi" />
          <div className="card-body text-gray-500 font-semibold bg-sky-200">
            <h5 className="card-title fs-4">Hindi</h5>
            <button onClick={() => speak({ text: hinText })}>
              <img src={vol} alt="volume" />
            </button>
            <p className="card-text p-2">10 lessons • 5 quizes</p>
            <p className="card-text p-2">
              <img className="h-30 w-10 rounded-full" src={profile} alt="" />
              Shams Tabrez
            </p>
            <div className="d-flex gap-2 mt-2">
              <a href="videos" className="btn btn-outline-primary">
                <Link to="/videos?subject=Hindi" className="nav-link active">Enroll</Link>
              </a>
              <button
                className="btn btn-success btn-sm"
                onClick={() => openAddVideo("Hindi")}
              >
                ➕ Add Video
              </button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card" style={{ width: "18rem" }}>
          <img src={hin} className="card-img-top" alt="Hindi Vyakaran" />
          <div className="card-body text-gray-500 font-semibold bg-sky-200">
            <h5 className="card-title fs-4">Hindi Vyakaran</h5>
            <button onClick={() => speak({ text: hinText })}>
              <img src={vol} alt="volume" />
            </button>
            <p className="card-text p-2">10 lessons • 5 quizes</p>
            <p className="card-text p-2">
              <img className="h-30 w-10 rounded-full" src={profile} alt="" />
              Shams Tabrez
            </p>
            <div className="d-flex gap-2 mt-2">
              <a href="videos" className="btn btn-outline-primary">
                <Link to="/videos?subject=Hindi" className="nav-link active">Enroll</Link>
              </a>
              <button
                className="btn btn-success btn-sm"
                onClick={() => openAddVideo("Hindi")}
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

export default HindiCatalogue;
