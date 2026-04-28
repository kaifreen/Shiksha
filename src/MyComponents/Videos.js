import { Button, Heading, Stack, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
// import {Card, CardText, CardBody, CardTitle, CardSubtitle, CardImg} from 'reactstrap';
import {
  Card,
} from "@chakra-ui/react";
import Header from "./../MyComponents/Header";
import Footer from "./../MyPages/Footer";
import numberVideo from "../Videos/Number.mp4";
import english1Video from "../Videos/English1.mp4";
import english2Video from "../Videos/English2.mp4";
import hindi1Video from "../Videos/Hindi1.mp4";
import hindi2Video from "../Videos/Hindi2.mp4";
import science2Video from "../Videos/Science2.mp4";

const Videos = () => {
  const videotitle = [
    {
      name: "Lecture Title",
      description:
        "This is a sample video for testing and demo. This is called description.This is a sample video for testing and demo. This is called description.This is a sample video for testing and demo. This is called description.This is a sample video for testing and demo. This is called description.",
    },
  ];

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

  function about() {
    var player = { videoSrc };
    player.on("timeupdate", function () {
      var currentTime = player.currentTime();
      var duration = player.duration();

      if (currentTime / duration >= 0.5) {
        console.log("The user spent at least 50% of the video.");
      }
    });

    <VStack spacing={2} alignItems={"flex-start"} p={"6"} w={"full"}>
      {videotitle.map((item) => (
        // <Heading key={videotitle.name}>{videotitle.name}</Heading>
        <Card maxW="l">
          <Heading key={item.name}>{item.name}</Heading>
          <Text key={item.description}>{item.description}</Text>
        </Card>
      ))}
      ;
    </VStack>;
  }
  return (
    <>
      <Header />
      <Stack direction={["column", "row"]} h={"100vh"}>
        <VStack w={"full"}>
          <video
            controls
            controlsList="nodownload"
            src={videoSrc}
            key={videotitle}
            style={{
              width: "100%",
              marginTop: "0.6rem",
            }} onClick={about}
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
