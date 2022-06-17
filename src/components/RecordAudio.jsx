import React, { useRef, useState } from "react";
import StopIcon from "@mui/icons-material/Stop";
import MicIcon from "@mui/icons-material/Mic";
import { IconButton } from "@mui/material";

const RecordAudio = ({}) => {
  const audioRef = useRef(null);
  const chunks = [];
  let rec;

  const onStart = () => {
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
        <IconButton onClick={onStart}>
          <MicIcon sx={{ color: "#000" }} />
        </IconButton>
        <div style={{ width: "10pt" }} />
        <IconButton sx={{ marginRight: "10pt" }} onClick={() => rec.stop()}>
          <StopIcon color="error" />
        </IconButton>
        <audio ref={audioRef} style={{ width: "100%", maxWidth: "200pt" }} />
      </div>
    </>
  );
};

export default RecordAudio;
