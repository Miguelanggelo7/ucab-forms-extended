import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Pagination,
  PaginationItem,
  Tooltip,
  Typography,
  Stack,
  Grid,
} from "@mui/material";
import { format } from "date-fns";
import {
  CHECKBOX,
  FILE,
  DATE,
  DATETIME,
  SLIDER,
  SORTABLE,
  RATING,
  TIME,
  VOICE,
  SLIDERMOJI,
  IMAGE,
  ARRAY,
} from "../../constants/questions";
import { useForm } from "../../hooks/useForm";
import Comments from "./Comments";
import Slider from "../Slider";
import Rating from "../Rating";
import FilesResponse from "./FilesResponse";
import Slidermoji from "../Slidermoji";
import ArrayTable from "../ArrayTable";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination as PagSwiper, Navigation } from "swiper";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/bundle";
import "./Slider.css";

SwiperCore.use([PagSwiper]);
SwiperCore.use([Navigation]);

const Response = () => {
  const { responses, questions } = useForm();
  const [page, setPage] = useState(1);

  return useMemo(() => {
    const renderItem = (item) => {
      let title = "";

      if (item.type === "page") {
        title = format(
          responses[item.page - 1].submittedAt,
          "dd/MM/yyyy hh:mm a"
        );
      } else if (item.type === "previous") {
        title = "Anterior";
      } else if (item.type === "next") {
        title = "Siguiente";
      }

      return (
        <Tooltip title={title} arrow>
          <span>
            <PaginationItem {...item} />
          </span>
        </Tooltip>
      );
    };

    const renderValue = (value, question) => {
      if (question.type === CHECKBOX) {
        return (
          <FormGroup>
            {value.map((option, i) => (
              <FormControlLabel
                key={i}
                disabled
                checked
                control={<Checkbox />}
                label={<Typography>{option}</Typography>}
              />
            ))}
          </FormGroup>
        );
      }

      if (question.type === SORTABLE) {
        return (
          <Stack spacing={1}>
            {value.map((option, i) => (
              <Card key={i} sx={{ p: 2 }}>
                <Typography>{option}</Typography>
              </Card>
            ))}
          </Stack>
        );
      }

      if (question.type === SLIDER) {
        return <Slider disabled question={question} value={value} />;
      }

      if (question.type === SLIDERMOJI) {
        return <Slidermoji disabled question={question} value={value} />;
      }

      if (question.type === RATING) {
        return <Rating question={question} readOnly value={value} />;
      }

      if (question.type === FILE || question.type === IMAGE) {
        return <FilesResponse files={value} />;
      }

      if (question.type === VOICE) {
        return (
          <>
            <audio controls src={value.url} />
            <Typography variant="caption" color="text.secondary">
              Posible traduccion
            </Typography>
            <Typography>{value.text}</Typography>
          </>
        );
      }

      if (question.type === ARRAY) {
        return (
          <ArrayTable disabled isAnswer question={question} answers={value} />
        );
      }

      let text = value;

      if (question.type === DATE) {
        text = format(value.toDate(), "dd/MM/yyyy");
      } else if (question.type === DATETIME) {
        text = format(value.toDate(), "dd/MM/yyyy hh:mm a");
      } else if (question.type === TIME) {
        text = format(value.toDate(), "hh:mm a");
      }

      return <Typography>{text}</Typography>;
    };

    const response = responses[page - 1];

    return (
      <Box>
        <Stack spacing={2}>
          <Pagination
            count={responses.length}
            page={page}
            onChange={(e, p) => setPage(p)}
            color="primary"
            shape="rounded"
            renderItem={renderItem}
          />
          <Typography>Respondido por:</Typography>
          <Typography>
            {responses[page - 1].user
              ? responses[page - 1].user.name
              : "Anónimo"}
          </Typography>
          <Typography align="right" variant="caption" color="text.secondary">
            Respondido el {format(response.submittedAt, "dd/MM/yyyy, hh:mm a")}
          </Typography>
          {response.location && (
            <Card sx={{ p: 3 }} variant="outlined">
              <Typography mb={2}>Ubicación</Typography>
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  pt: "75%",
                }}
              >
                <Box
                  component="iframe"
                  title="user-location"
                  src={`https://maps.google.com/maps?q=${response.location.latitude},${response.location.longitude}&hl=es;z=15&output=embed`}
                  allowFullScreen
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                />
              </Box>
            </Card>
          )}
          {questions.map((question, index) => (
            <Box>
              <Card key={question.id} sx={{ p: 3, mb: 1 }} variant="outlined">
                <Typography gutterBottom>
                  {question.title}
                  <br />
                  <Typography variant="caption">
                    {question.description}
                  </Typography>
                </Typography>
                <Swiper
                  slidesPerView={1}
                  pagination={{ clickable: "true" }}
                  className="mySwiper"
                  onSlideChange={() => console.log("slide change")}
                  onSwiper={(swiper) => console.log(swiper)}
                  style={{ marginBottom: "20pt" }}
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
                {response.answers[question.id] === "" ||
                response.answers[question.id] === null ||
                response.answers[question.id] === undefined ||
                response.answers[question.id]?.length === 0 ? (
                  <Typography fontStyle="italic">Respuesta vacía</Typography>
                ) : (
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                      Respuesta
                    </Typography>
                    {renderValue(response.answers[question.id], question)}
                  </Stack>
                )}
              </Card>
              <Comments response={response} question={question} />
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }, [responses, page, questions]);
};

export default Response;
