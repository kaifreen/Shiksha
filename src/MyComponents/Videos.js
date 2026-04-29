import { Button, Stack, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
// import {Card, CardText, CardBody, CardTitle, CardSubtitle, CardImg} from 'reactstrap';

import Header from "./../MyComponents/Header";
import Footer from "./../MyPages/Footer";
import numberVideo from "../Videos/Number.mp4";
import english1Video from "../Videos/English1.mp4";
import english2Video from "../Videos/English2.mp4";
import hindi1Video from "../Videos/Hindi1.mp4";
import hindi2Video from "../Videos/Hindi2.mp4";
import science2Video from "../Videos/Science2.mp4";
import axios from "axios";
import { getAuth } from "firebase/auth";
import app from "../firebase";

const Videos = () => {


  const [showModal, setShowModal] = React.useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subjectQuery = searchParams.get("subject");

  const videosArr = [
    { src: numberVideo, title: "Maths - Number", subject: "Maths" },
    { src: english1Video, title: "English - Lecture 1", subject: "English" },
    { src: english2Video, title: "English - Lecture 2", subject: "English" },
    { src: hindi1Video, title: "Hindi - Lecture 1", subject: "Hindi" },
    { src: hindi2Video, title: "Hindi - Lecture 2", subject: "Hindi" },
    { src: science2Video, title: "Science - Lecture 1", subject: "Science" },
  ];

  const filteredVideos = subjectQuery
    ? videosArr.filter(v => v.subject === subjectQuery)
    : videosArr;

  const [videoSrc, setVideoSrc] = useState(filteredVideos.length > 0 ? filteredVideos[0].src : "");
  const [trackedVideos, setTrackedVideos] = useState(new Set());

  const auth = getAuth(app);
  const activeVideo = filteredVideos.find(v => v.src === videoSrc);

  const handleTimeUpdate = async (e) => {
    const video = e.target;
    if (!video.duration || !activeVideo) return;

    // Check if watched at least 50%
    if (video.currentTime / video.duration >= 0.5) {
      const videoKey = activeVideo.title;

      // If we haven't tracked this video yet and the user is logged in
      if (!trackedVideos.has(videoKey) && auth.currentUser) {
        // Optimistically add to tracked set so we don't spam the API
        setTrackedVideos(prev => new Set(prev).add(videoKey));

        try {
          await axios.post('http://localhost:5000/api/progress/watch-video', {
            userId: auth.currentUser.uid,
            courseId: activeVideo.subject,
            videoId: activeVideo.title
          });
          console.log("Progress saved for:", activeVideo.title);
        } catch (error) {
          console.error("Failed to update progress:", error);
          // If it fails, remove it from the set so it can try again
          setTrackedVideos(prev => {
            const newSet = new Set(prev);
            newSet.delete(videoKey);
            return newSet;
          });
        }
      }
    }
  };
  return (
    <>
      <Header />
      <Stack direction={["column", "row"]} h={"100vh"}>
        <VStack w={"full"}>
          <video
            controls
            controlsList="nodownload"
            src={videoSrc}
            key={videoSrc}
            onTimeUpdate={handleTimeUpdate}
            style={{
              width: "100%",
              marginTop: "0.6rem",
            }}
          ></video>

          {showModal ? (
            <>
              <p className="text-gray-800 hover:text-sky-400 w-auto">
                This is a sample video for testing and demo. This is called
                description.
              </p>
            </>
          ) : null}
          <button
            className="overflow-x-hidden overflow-y-hidden bg-gray-800 text-white active:bg-gray-600 font-bold uppercase text-xl px-4 py-2 shadow hover:shadow-lg outline-none rounded focus:outline-none ease-linear transition-all duration-150"
            type="button"
            onClick={() => setShowModal(true)}
            onDoubleClick={() => setShowModal(false)}
          >
            Lecture Description
          </button>
        </VStack>

        <VStack
          w={["full", "xl"]}
          alignItems={"stretch"}
          p="8"
          spacing={"8"}
          overflowY={"auto"}
        >
          {filteredVideos.map((item, index) => (
            <Button
              variant={"contained"}
              colorScheme={"blue"}
              onClick={() => setVideoSrc(item.src)}
              key={index}
            >
              {item.title}
            </Button>
          ))}
        </VStack>
      </Stack>
      <Footer />
    </>
  );
};

export default Videos;
