import { memo } from "react";
import {
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Radio,
  Rating,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DragHandle as DragHandleIcon } from "@mui/icons-material";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/lab";
import {
  CHECKBOX,
  DATE,
  DATETIME,
  FILE,
  RADIO,
  RATING,
  SELECT,
  SLIDER,
  SORTABLE,
  TEXT,
  TEXTAREA,
  TIME,
} from "../constants/questions";
import Select from "./Select";
import Slider from "./Slider";
import UploadButton from "./UploadButton";
import { useFont } from "../hooks/useFont";

const QuestionPreview = ({ question }) => {
  const { font } = useFont();

  switch (question.type) {
    case TEXT:
      return (
        <TextField
          disabled
          InputProps={{ style: { fontSize: font.size } }}
          variant="standard"
          value="Texto de respuesta breve"
        />
      );
    case TEXTAREA:
      return (
        <TextField
          disabled
          InputProps={{ style: { fontSize: font.size } }}
          variant="standard"
          value="Texto de respuesta larga"
          fullWidth
        />
      );
    case RADIO:
      return (
        <RadioGroup>
          {question.options.map((option, i) => (
            <FormControlLabel
              key={i}
              disabled
              sx={{ fontSize: font.size }}
              value={option}
              control={<Radio />}
              label={option}
            />
          ))}
          {question.other && (
            <FormControlLabel
              disabled
              sx={{ fontSize: font.size }}
              value="otros"
              control={<Radio />}
              label="Otros"
            />
          )}
        </RadioGroup>
      );
    case CHECKBOX:
      return (
        <FormGroup>
          {question.options.map((option, i) => (
            <FormControlLabel
              key={i}
              disabled
              value={option}
              control={<Checkbox />}
              label={option}
            />
          ))}
          {question.other && (
            <FormControlLabel
              disabled
              value="otros"
              control={<Checkbox />}
              label="Otros"
            />
          )}
        </FormGroup>
      );
    case SELECT:
      return (
        <Select variant="standard" displayEmpty defaultValue="">
          {question.options.map((option, i) => (
            <MenuItem disabled key={i} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      );
    case SORTABLE:
      return (
        <Stack spacing={1}>
          {question.options.map((option, i) => (
            <Card
              key={i}
              sx={{
                p: 2,
                color: "text.disabled",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography>{option}</Typography>
              <DragHandleIcon />
            </Card>
          ))}
        </Stack>
      );
    case SLIDER:
      return <Slider disabled defaultValue={1} question={question} />;
    case RATING:
      return <Rating disabled />;
    case DATE:
      return (
        <DatePicker
          label="Día, mes, año"
          disabled
          value={null}
          onChange={() => null}
          renderInput={(params) => <TextField variant="standard" {...params} />}
        />
      );
    case TIME:
      return (
        <TimePicker
          label="Hora"
          disabled
          value={null}
          onChange={() => null}
          renderInput={(params) => <TextField variant="standard" {...params} />}
        />
      );
    case DATETIME:
      return (
        <DateTimePicker
          label="Fecha y hora"
          disabled
          value={null}
          onChange={() => null}
          renderInput={(params) => <TextField variant="standard" {...params} />}
        />
      );
    case FILE:
      return <UploadButton disabled />;
    default:
      return null;
  }
};

export default memo(QuestionPreview);
