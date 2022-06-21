import React, { useEffect, useRef, useState } from "react";
import StopIcon from "@mui/icons-material/Stop";
import MicIcon from "@mui/icons-material/Mic";
import { IconButton, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import { keyframes } from "@mui/system";

const blink = keyframes`
  0% {
    opacity: 0;
  }
  50%, {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const RecordAudio = ({}) => {
  const audioRef = useRef(null);
  const stopRef = useRef(null);
  const startRef = useRef(null);
  const micRef = useRef(null);
  const recRef = useRef(null);
  const chunks = [];
  let rec;

  const onStart = () => {
    stopRef.current.style.display = "block";
    recRef.current.style.display = "block";
    startRef.current.style.opacity = 0;
    micRef.current.style.display = "none";
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      rec = new MediaRecorder(stream);
      rec.start();

      chunks.splice(0, chunks.length);

      rec.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      rec.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/mp3" });
        const blobURL = URL.createObjectURL(blob);
        //localStorage.setItem(name, blobURL);
        audioRef.current.src = blobURL;
        audioRef.current.controls = true;
        stopRef.current.style.display = "none";
        startRef.current.style.opacity = 1;
        micRef.current.style.display = "block";
        recRef.current.style.display = "none";
      };
    });
  };

  return (
    <>
      <div
        style={{
          margin: "10pt",
          display: "inline-flex",
          width: "100%",
        }}
      >
        <IconButton
          ref={micRef}
          onClick={onStart}
          sx={{ height: "40px", marginTop: "8px", marginRight: "10pt" }}
        >
          <MicIcon sx={{ color: "#000" }} />
        </IconButton>
        <IconButton
          ref={stopRef}
          sx={{
            marginRight: "10pt",
            height: "40px",
            marginTop: "8px",
            display: "none",
          }}
          onClick={() => rec.stop()}
        >
          <StopIcon sx={{ color: "#000" }} />
        </IconButton>
        <IconButton
          sx={{
            marginRight: "10pt",
            height: "40px",
            marginTop: "8px",
            animation: `${blink} 2s infinite ease`,
            display: "none",
          }}
          disabled
          ref={recRef}
        >
          <CircleIcon color="error" sx={{ fontSize: "18px" }} />
        </IconButton>
        <audio ref={audioRef} style={{ width: "100%", maxWidth: "200pt" }} />
      </div>
      <Typography ref={startRef} variant="caption">
        Presione el micrófono para grabar un audio
      </Typography>
    </>
  );
};

export default RecordAudio;
