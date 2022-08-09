import { useMemo } from "react";
import {
  Card,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { useForm } from "../../hooks/useForm";
import AllQuestionsPreview from "../AllQuestionsPreview";
import RequiredMark from "../RequiredMark";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/bundle";
import "./Slider.css";

SwiperCore.use([Pagination]);
SwiperCore.use([Navigation]);

const EditQuestion = ({ question, setOpenDrawer }) => {
  const { current, setCurrent } = useForm();

  return useMemo(() => {
    const handleClick = () => {
      setCurrent(question.id);
      setOpenDrawer(true);
    };

    return (
      <motion.div
        whileHover={{ scale: question.id === current ? 1 : 1.02 }}
        whileTap={{ scale: question.id === current ? 1 : 0.98 }}
      >
        <Card
          sx={{ p: 3, cursor: "pointer" }}
          onClick={handleClick}
          elevation={question.id === current ? 5 : 0}
          variant={question.id === current ? "elevation" : "outlined"}
        >
          <div style={{ maxWidth: "90%", wordWrap: "break-word" }}>
            <Typography mb={2}>
              {question.title}
              <RequiredMark question={question} />
              <br />
              <Typography variant="caption">{question.description}</Typography>
            </Typography>
          </div>
          <Swiper
            slidesPerView={1}
            pagination={{ clickable: "true" }}
            className="mySwiper"
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            style={{ marginBottom: "10pt" }}
          >
            {question.image?.map((file, i) => (
              <SwiperSlide>
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <img
                    alt="imagen"
                    key={i}
                    src={file.url}
                    style={{ maxHeight: "300pt", objectFit: "contain" }}
                  />
                </Grid>
              </SwiperSlide>
            ))}
          </Swiper>
          <AllQuestionsPreview question={question} />
        </Card>
      </motion.div>
    );
  }, [current, question, setOpenDrawer, setCurrent]);
};

export default EditQuestion;
