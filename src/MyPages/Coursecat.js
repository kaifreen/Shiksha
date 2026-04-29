import React from "react";
import SubjectCards from "../MyComponents/SubjectCards";
import Catalogue from "../MyComponents/Catalogue";
import Footer from './../MyPages/Footer';
import Header from './../MyComponents/Header';
import bg from './../images/coursecatbg.png'


function Coursecat() {
  return (
    <div>
      <Header/>
      <div>
        <img src={bg} alt="bg" width={"100%"} height="400" className="acc1"></img>
        <div className="position-relative"></div>
        <div className="position-absolute top-50 start-50 translate-middle">
          <p className="text-warning display-3 fw-semibold">
          </p>
          <p className="text-white fs-3 fw-light my-1">
          </p>
        </div>
      </div>
      <SubjectCards/>
      <Catalogue />
      <Footer/>
    </div>
  );
}

export default Coursecat;

