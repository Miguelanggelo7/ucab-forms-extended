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
import { useForm } from "../../hooks/useForm";
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
  IMAGE,
  ARRAY,
} from "../../constants/questions";
import { getResponseCountText } from "../../utils/stats";
import Slider from "../Slider";
import Rating from "../Rating";
import FilesResponse from "./FilesResponse";
import RecordAudio from "../RecordAudio";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination as PagSwiper, Navigation } from "swiper";
import ArrayTable from "../ArrayTable";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/bundle";
import "./Slider.css";

SwiperCore.use([PagSwiper]);
SwiperCore.use([Navigation]);

const ResponsesByQuestion = () => {
  const { responses, questions } = useForm();
  const [page, setPage] = useState(1);

  const question = questions[page - 1];
  const answers = responses.map((r) => r.answers);

  const answersWithStats = useMemo(() => {
    const responseCount = {};

    answers.forEach((response) => {
      let value = response[question.id];

      if (question.type === CHECKBOX) {
        if (!value) {
          value = [];
        }
        value = [...value].sort();
      } else if (question.type === DATE && value) {
        value = format(value.toDate(), "dd/MM/yyyy");
      } else if (question.type === DATETIME && value) {
        value = format(value.toDate(), "dd/MM/yyyy hh:mm a");
      } else if (question.type === TIME && value) {
        value = format(value.toDate(), "hh:mm a");
      }

      if (question.type === FILE && !value) {
        value = [];
      }

      if (!value) {
        value = "";
      }

      value = JSON.stringify(value);

      if (responseCount[value]) {
        responseCount[value]++;
      } else {
        responseCount[value] = 1;
      }
    });

    const sortedResponseCount = Object.entries(responseCount).sort(
      ([valueA, countA], [valueB, countB]) => countB - countA
    );

    return sortedResponseCount.map(([value, count]) => ({
      value: JSON.parse(value),
      count,
    }));
  }, [answers, question.id, question.type]);

  return useMemo(() => {
    const renderItem = (item) => {
      let title = "";

      if (item.type === "page") {
        title = questions[item.page - 1].title;
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

    const renderValue = (value) => {
      if (question.type === CHECKBOX) {
        return (
          <FormGroup>
            {value.map((option, i) => (
              <FormControlLabel
                key={i}
                disabled
                checked={true}
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

      if (question.type === RATING) {
        return <Rating question={question} readOnly value={value} />;
      }

      if (question.type === FILE || question.type === IMAGE) {
        return <FilesResponse files={value} />;
      }

      if (question.type === VOICE) {
        return <audio controls src={value.url} />;
      }

      if (question.type === ARRAY) {
        return (
          <ArrayTable disabled isAnswer question={question} answers={value} />
        );
      }

      return <Typography>{value}</Typography>;
    };

    return (
      <Box>
        <Stack spacing={2}>
          <Pagination
            count={questions.length}
            page={page}
            onChange={(e, p) => setPage(p)}
            color="primary"
            shape="rounded"
            renderItem={renderItem}
          />
          <Card sx={{ p: 3 }} variant="outlined">
            <Typography fontSize="h6">
              {question.title}
              <br />
              <Typography variant="caption">{question.description}</Typography>
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
          </Card>
          {answersWithStats.map((response, i) => (
            <Card key={i} sx={{ p: 3 }} variant="outlined">
              <Box sx={{ mb: 1 }}>
                {response.value === "" ||
                response.value === undefined ||
                response.value === null ||
                response.value.length === 0 ? (
                  <Typography fontStyle="italic">Respuesta vacía</Typography>
                ) : (
                  renderValue(response.value)
                )}
              </Box>
              <Typography color="text.secondary" variant="caption">
                {getResponseCountText(response.count)}
              </Typography>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }, [questions, page, question, answersWithStats]);
};

export default ResponsesByQuestion;
