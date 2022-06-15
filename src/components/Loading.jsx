import { Box } from "@mui/material";
import { keyframes } from "@mui/system";
import { motion } from "framer-motion";

const blink = keyframes`
  0% {
    opacity: 1;
  }
  50%, {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const icon = {
  hidden: {
    opacity: 0,
    pathLength: 0,
    fill: "rgba(255, 255, 255, 0)",
  },
  visible: {
    opacity: 1,
    pathLength: 1,
    fill: "#4B7ABC",
  },
  visible2: {
    opacity: 1,
    pathLength: 1,
    fill: "#FFF120",
  },
  visible3: {
    opacity: 1,
    pathLength: 1,
    fill: "#006225",
  },
  visible4: {
    opacity: 1,
    pathLength: 1,
    fill: "#fff",
  },
};

const Loading = () => {
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          animation: `${blink} 3s infinite ease`,
          animationDelay: "4s",
          p: 2,
        }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2010/svg"
          viewBox="0 0 139 128"
          style={{ width: "60vw", height: "40vh" }}
        >
          <motion.path
            d="M69.5 19L88.9856 41.5V86.5L69.5 109L50.0144 86.5V41.5L69.5 19Z"
            stroke="#4B7ABC"
            stroke-width=".5"
            fill="#4B7ABC"
            variants={icon}
            initial="hidden"
            animate="visible"
            transition={{
              default: { duration: 1, ease: "easeInOut" },
              fill: { duration: 1.8, ease: [1, 0, 0.8, 1] },
            }}
          />
          <motion.path
            d="M114.5 19L133.986 41.5V86.5L114.5 109L95.0144 86.5V41.5L114.5 19Z"
            stroke="#006225"
            stroke-width=".5"
            fill="#006225"
            variants={icon}
            initial="hidden"
            animate="visible3"
            transition={{
              default: { duration: 1, ease: "easeInOut" },
              fill: { duration: 1.8, ease: [1, 0, 0.8, 1] },
            }}
          />
          <motion.path
            d="M24.5 19L43.9856 41.5V86.5L24.5 109L5.01443 86.5V41.5L24.5 19Z"
            stroke="#FFF120"
            stroke-width=".5"
            fill="#FFF120"
            variants={icon}
            initial="hidden"
            animate="visible2"
            transition={{
              default: { duration: 1, ease: "easeInOut" },
              fill: { duration: 1.8, ease: [1, 0, 0.8, 1] },
            }}
          />
        </motion.svg>
      </Box>
    </>
  );
};

export default Loading;
