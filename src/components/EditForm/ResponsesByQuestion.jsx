import { useMemo, useState } from "react";
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link,
  Pagination,
  PaginationItem,
  Tooltip,
  Typography,
  Stack,
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
} from "../../constants/questions";
import { getResponseCountText } from "../../utils/stats";
import Slider from "../Slider";
import Rating from "../Rating";

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
        value = [...value].sort();
      } else if (question.type === DATE && value) {
        value = format(value.toDate(), "dd/MM/yyyy");
      } else if (question.type === DATETIME && value) {
        value = format(value.toDate(), "dd/MM/yyyy hh:mm a");
      } else if (question.type === TIME && value) {
        value = format(value.toDate(), "hh:mm a");
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
        return <Rating readOnly value={value} />;
      }

      if (question.type === FILE) {
        return (
          <Stack sx={{ alignItems: "flex-start" }} spacing={2}>
            {value.map((file, i) => {
              if (file.type.includes("image")) {
                return (
                  <Box
                    component="img"
                    key={i}
                    src={file.url}
                    alt="response"
                    sx={{ maxWidth: "100%" }}
                  />
                );
              }

              return (
                <Link download href={file.url}>
                  {file.name}
                </Link>
              );
            })}
          </Stack>
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
            <Typography fontSize="h6.fontSize">{question.title}</Typography>
          </Card>
          {answersWithStats.map((response, i) => (
            <Card key={i} sx={{ p: 3 }} variant="outlined">
              <Box sx={{ mb: 1 }}>
                {response.value === "" || response.value.length === 0 ? (
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
