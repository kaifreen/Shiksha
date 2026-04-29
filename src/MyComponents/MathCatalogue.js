import React, { useState } from "react";
import { Link } from "react-router-dom";
import vol from "./../images/volume.png";
import profile from "./../images/profile.png";
import { useSpeechSynthesis } from "react-speech-kit";
import AddVideoModal from "./AddVideoModal";

function MathCatalogue() {
  const { speak } = useSpeechSynthesis();
  const basicmath = "Basics of Mathemetics. It contains 12 lectures and 7 quizes";
  const simmath = "Simplified Mathemetics. It contains 12 lectures and 7 quizes";

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
          <img src="/math.png" className="card-img-top" alt="Basics of Mathematics" />
          <div className="card-body text-gray-500 font-semibold bg-sky-200">
            <h5 className="card-title fs-4">Basics of Mathemetics</h5>
            <button onClick={() => speak({ text: basicmath })}>
              <img src={vol} alt="volume" />
            </button>
            <p className="card-text p-2">12 lessons • 7 quiz</p>
            <p className="card-text p-2">
              <img
                className="h-30 w-10 rounded-full"
                src="https://media.licdn.com/dms/image/D4D03AQG3tgMaLVMfug/profile-displayphoto-shrink_100_100/0/1666875030217?e=1685577600&v=beta&t=vfoT736oR7cZXkuDcl9J6ZSnJIOaJzpkaJ1D-Y6qh_0"
                alt=""
              />
              <img className="h-30 w-10 rounded-full" src={profile} alt="" />
              Sachin Bellani
            </p>
            <div className="d-flex gap-2 mt-2">
              <a href="videos" className="btn btn-outline-primary">
                <Link to="/videos?subject=Maths" className="nav-link active">Enroll</Link>
              </a>
              <button
                className="btn btn-success btn-sm"
                onClick={() => openAddVideo("Maths")}
              >
                ➕ Add Video
              </button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card" style={{ width: "18rem" }}>
          <img src="/math.png" className="card-img-top" alt="Simplified Mathematics" />
          <div className="card-body text-gray-500 font-semibold bg-sky-200">
            <h5 className="card-title fs-4">Simplified Mathemetics</h5>
            <button onClick={() => speak({ text: simmath })}>
              <img src={vol} alt="volume" />
            </button>
            <p className="card-text p-2">12 lessons • 7 quiz</p>
            <p className="card-text p-2">
              <img className="h-30 w-10 rounded-full" src={profile} alt="" />
              Shams Tabrez
            </p>
            <div className="d-flex gap-2 mt-2">
              <a href="videos" className="btn btn-outline-primary">
                <Link to="/videos?subject=Maths" className="nav-link active">Enroll</Link>
              </a>
              <button
                className="btn btn-success btn-sm"
                onClick={() => openAddVideo("Maths")}
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

export default MathCatalogue;
