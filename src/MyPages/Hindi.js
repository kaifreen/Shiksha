import React from "react";
import HindiCatalogue from "../MyComponents/HindiCatalogue";
import Footer from './Footer';
import Header from '../MyComponents/Header';
import bg from './../images/hin.png';

function Hindi() {
  return (
    <div>
      <Header/>
      <div>
        <img src={bg} alt="bg" width={"100%"} height="400" style={{objectFit: 'contain'}}></img>
        <div class="position-relative"></div>
        <div class="position-absolute top-50 start-50 translate-middle">
          <p class="text-warning display-3 fw-semibold">
          </p>
          <p class="text-white fs-3 fw-light my-1">
          </p>
        </div>
      </div>
      <HindiCatalogue />
      <Footer/>
    </div>
  );
}

export default Hindi;
