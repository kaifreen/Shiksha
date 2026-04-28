import React from "react";
import { Link } from "react-router-dom";
import vol from "./../images/volume.png";
import profile from "./../images/profile.png";
import { useSpeechSynthesis } from "react-speech-kit";
import hin from "./../images/hin.png";

function HindiCatalogue() {
  const { speak } = useSpeechSynthesis();
  const hinText = "Hindi. It contains 10 lectures and 5 quizes";
  return (
    <div class=" m-3	">
      <div className="d-flex flex-wrap gap-5 pt-5 ">
        <div class="card" style={{ width: "18rem" }}>
          <img src={hin} class="card-img-top" alt="Hindi" />
          <div className="card-body text-gray-500 font-semibold bg-sky-200 ">
            <h5 class="card-title fs-4 ">Hindi</h5>
            <button onClick={() => speak({ text: hinText })}>
              <img src={vol} alt="volume"></img>
            </button>
            <p class="card-text p-2">10 lessons • 5 quizes</p>
            <p class="card-text p-2">
              <img className="h-30 w-10 rounded-full" src={profile} alt="" />
              Shams Tabrez
            </p>
            <a href="videos" class="btn btn-outline-primary">
              <Link to="/videos?subject=Hindi" class="nav-link active">
                Enroll
              </Link>
            </a>
          </div>
        </div>

        <div class="card" style={{ width: "18rem" }}>
          <img src={hin} class="card-img-top" alt="Hindi Vyakaran" />
          <div className="card-body text-gray-500 font-semibold bg-sky-200 ">
            <h5 class="card-title fs-4 ">Hindi Vyakaran</h5>
            <button onClick={() => speak({ text: hinText })}>
              <img src={vol} alt="volume"></img>
            </button>
            <p class="card-text p-2">10 lessons • 5 quizes</p>
            <p class="card-text p-2">
              <img className="h-30 w-10 rounded-full" src={profile} alt="" />
              Shams Tabrez
            </p>
            <a href="videos" class="btn btn-outline-primary">
              <Link to="/videos?subject=Hindi" class="nav-link active">
                Enroll
              </Link>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HindiCatalogue;
