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
            {/* Public Routes - Only login and signup */}
            <Route path="/" element={<LoginPage/>} />
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            
            {/* Protected Routes - Require authentication */}
            <Route path="/home" element={<ProtectedRoute><Hero/></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
            <Route path="/video" element={<ProtectedRoute><Videos/></ProtectedRoute>} />
            <Route path="/videos" element={<ProtectedRoute><Videos/></ProtectedRoute>} />
            <Route path="/coursecat" element={<ProtectedRoute><Coursecat/></ProtectedRoute>} />
            <Route path="/recruiter" element={<ProtectedRoute><Home/></ProtectedRoute>} />
            <Route path="/aboutus" element={<ProtectedRoute><Aboutus/></ProtectedRoute>} />
            <Route path="/ngoenroll" element={<ProtectedRoute><Ngoenroll/></ProtectedRoute>} />
            <Route path="/donation" element={<ProtectedRoute><Donation/></ProtectedRoute>} />
            <Route path="/sidebarvideo" element={<ProtectedRoute><Sidebarvideo/></ProtectedRoute>} />
            <Route path="/leaders" element={<ProtectedRoute><Lead/></ProtectedRoute>}/>
            <Route path="/banner" element={<ProtectedRoute><Banner/></ProtectedRoute>}/>
            <Route path="/science" element={<ProtectedRoute><Science/></ProtectedRoute>}/>
            <Route path="/math" element={<ProtectedRoute><Math/></ProtectedRoute>}/>
            <Route path="/english" element={<ProtectedRoute><English/></ProtectedRoute>}/>
            
            {/* Catch-all redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
