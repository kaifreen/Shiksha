import './App.css';
import './index.css';
import './mic.css';
import Home from './MyPages/Home';
import Hero from './MyPages/Hero';
import Coursecat from './MyPages/Coursecat';
import Aboutus from './MyPages/Aboutus';
import Donation from './MyPages/Donation';
import Ngoenroll from './MyComponents/Ngoenroll';
// import Career from './MyPages/Career';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import  Videos  from './MyComponents/Videos';
import Sidebarvideo from './MyComponents/Sidebarvideos';
import React, { useState, useRef } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Lead from "./MyComponents/leaders"
import Login from './MyComponents/login'
import LoginPage from './MyPages/Login'
import SignupPage from './MyPages/Signup'
import Banner from './MyComponents/banner'
import Profile from './MyPages/profile'
import Science from './MyPages/Science'
import Math from './MyPages/Math'
import English from './MyPages/English'
import VoiceNav from "./MyComponents/VoiceNav"
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  
  const commands = [
    {
      command: "open *",
      callback: (website) => {
        window.open("http://shikshaedu.vercel.app/" + website.split(" ").join(""));
      },
    },
    {
      command: "go to *",
      callback: (website) => {
        window.open("http://shikshaedu.vercel.app/" + website.split(" ").join(""));
      },
    },
    {
      command: "open courses",
      callback: (website) => {
        window.open("http://shikshaedu.vercel.app/coursecat");
      },
    },
    {
      command: "enroll for *",
      callback: (website) => {
        window.open("http://shikshaedu.vercel.app/videos");
      },
    },
    {
      command: "reset",
      callback: () => {
        handleReset();
      },
    },
    {
      command: "stop",
      callback: () => {
        stopHandle();
      },
    },
  ];

  const { resetTranscript } = useSpeechRecognition({ commands });
  const [, setIsListening] = useState(false);
  const microphoneRef = useRef(null);
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };

  return (
    <AuthProvider>
      <Router>
        <div className='App'>
          <VoiceNav/>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LoginPage/>} />
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="/home" element={<Hero/>} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
            <Route path="/video" element={<ProtectedRoute><Videos/></ProtectedRoute>} />
            <Route path="/videos" element={<ProtectedRoute><Videos/></ProtectedRoute>} />
            
            {/* Semi-Protected Routes (Accessible but better with auth) */}
            <Route path="/coursecat" element={<Coursecat/>} />
            <Route path="/recruiter" element={<Home/>} />
            <Route path="/aboutus" element={<Aboutus/>} />
            <Route path="/ngoenroll" element={<Ngoenroll/>} />
            <Route path="/donation" element={<Donation/>} />
            <Route path="/sidebarvideo" element={<Sidebarvideo/>} />
            <Route path="/leaders" element={<Lead/>}/>
            <Route path="/banner" element={<Banner/>}/>
            <Route path="/science" element={<Science/>}/>
            <Route path="/math" element={<Math/>}/>
            <Route path="/english" element={<English/>}/>
            
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
