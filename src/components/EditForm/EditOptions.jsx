import { useMemo } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import {
  CHECKBOX,
  RADIO,
  SELECT,
  SORTABLE,
  SLIDER,
  TEXT,
  TEXTAREA,
  SLIDERMOJI,
} from "../../constants/questions";
import { useForm } from "../../hooks/useForm";
import { useFont } from "../../hooks/useFont";

const sliderMinValues = [0, 1];
const sliderMaxValues = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const specialTypes = [
  {
    value: "name",
    label: "Nombre completo",
  },
  {
    value: "given-name",
    label: "Nombre",
  },
  {
    value: "family-name",
    label: "Apellido",
  },
  {
    value: "email",
    label: "Email",
  },
  {
    value: "tel",
    label: "Teléfono",
  },
  {
    value: "country-name",
    label: "País",
  },
  {
    value: "street-address",
    label: "Dirección",
  },
  {
    value: "postal-code",
    label: "Código postal",
  },
  {
    value: "organization",
    label: "Organización",
  },
  {
    value: "organization-title",
    label: "Profesión",
  },
];

const emojis = [
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f600.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f60d.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f621.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f631.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f62d.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f44d.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f44e.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f641.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f610.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f634.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f912.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/2764.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f642.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f614.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f62e.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f494.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f4a9.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f637.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f64f.png",
  },
  {
    url: "https://twemoji.maxcdn.com/2/72x72/1f628.png",
  },
];

const Options = ({ question, debouncedSave }) => {
  const { setQuestions } = useForm();
  const { font } = useFont();

  return useMemo(() => {
    const handleChangeOption = (i) => (e) => {
      const option = e.target.value;

      const options = [...question.options];
      options[i] = option;

      const newQuestion = { ...question, options };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const handleChange = (field) => (e) => {
      const value = e.target.value;

      const newQuestion = { ...question, [field]: value };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const handleEmoji = (field, emoji) => {
      const value = emoji;

      const newQuestion = { ...question, [field]: value };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const addOption = () => {
      const option = "Opción " + (question.options.length + 1);
      const newQuestion = {
        ...question,
        options: [...question.options, option],
      };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const deleteOption = (i) => () => {
      const options = [...question.options];
      options.splice(i, 1);

      const newQuestion = { ...question, options };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const addOther = () => {
      const newQuestion = { ...question, other: true };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const deleteOther = () => {
      const newQuestion = { ...question, other: false };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const EmojiButton = (props) => {
      return (
        <IconButton onClick={() => handleEmoji("urlEmoji", props.emoji)}>
          <img style={{ width: "40px" }} src={props.emoji} />
        </IconButton>
      );
    };

    switch (question.type) {
      case TEXT:
      case TEXTAREA:
        return (
          <TextField
            select
            variant="standard"
            label="Autocompletado especial"
            value={question.specialType}
            onChange={handleChange("specialType")}
          >
            <MenuItem value="">Ninguno</MenuItem>
            {specialTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
        );
      case RADIO:
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">Opciones</FormLabel>
            <RadioGroup sx={{ mb: 1 }}>
              {question.options.map((option, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <FormControlLabel
                    disabled
                    control={<Radio />}
                    value={option}
                    label={
                      <TextField
                        variant="standard"
                        value={option}
                        onChange={handleChangeOption(i)}
                      />
                    }
                  />
                  <Tooltip title="Eliminar">
                    <IconButton onClick={deleteOption(i)}>
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
              {question.other && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <FormControlLabel
                    disabled
                    control={<Radio />}
                    value="otros"
                    label="Otros"
                  />
                  <Tooltip title="Eliminar">
                    <IconButton onClick={deleteOther}>
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </RadioGroup>
            <Button onClick={addOption}>Agregar opción</Button>
            {!question.other && (
              <Button onClick={addOther}>Agregar "Otros"</Button>
            )}
          </FormControl>
        );
      case CHECKBOX:
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">Opciones</FormLabel>
            <FormGroup sx={{ mb: 1 }}>
              {question.options.map((option, i) => (
                <Box
                  key={i}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <FormControlLabel
                    disabled
                    control={<Checkbox />}
                    value={option}
                    label={
                      <TextField
                        variant="standard"
                        value={option}
                        onChange={handleChangeOption(i)}
                      />
                    }
                  />
                  <Tooltip title="Eliminar opción" arrow>
                    <IconButton onClick={deleteOption(i)}>
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
              {question.other && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <FormControlLabel
                    disabled
                    control={<Checkbox />}
                    value="otros"
                    label="Otros"
                  />
                  <Tooltip title="Eliminar" arrow>
                    <IconButton onClick={deleteOther}>
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </FormGroup>
            <Button onClick={addOption}>Agregar opción</Button>
            {!question.other && (
              <Button onClick={addOther}>Agregar "Otros"</Button>
            )}
          </FormControl>
        );
      case SELECT:
      case SORTABLE:
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">Opciones</FormLabel>
            <FormGroup sx={{ mb: 1 }}>
              {question.options.map((option, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      mr={2}
                      minWidth={15}
                      align="right"
                      color="text.secondary"
                    >
                      {i + 1}.
                    </Typography>
                    <TextField
                      variant="standard"
                      value={option}
                      onChange={handleChangeOption(i)}
                    />
                  </Box>
                  <Tooltip title="Eliminar opción" arrow>
                    <IconButton onClick={deleteOption(i)}>
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </FormGroup>
            <Button size="small" onClick={addOption}>
              Agregar opción
            </Button>
          </FormControl>
        );
      case SLIDER:
        return (
          <>
            <Box>
              <TextField
                select
                variant="standard"
                label="Desde"
                value={question.min}
                onChange={handleChange("min")}
                sx={{ width: 100, mr: 2 }}
              >
                {sliderMinValues.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                variant="standard"
                label="Hasta"
                value={question.max}
                onChange={handleChange("max")}
                sx={{ width: 100 }}
              >
                {sliderMaxValues.map((n) => (
                  <MenuItem key={n} value={n}>
                    {n}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <TextField
              variant="standard"
              value={question.minLabel ?? ""}
              label={`Etiqueta para ${question.min} (opcional)`}
              onChange={handleChange("minLabel")}
            />
            <TextField
              variant="standard"
              label={`Etiqueta para ${question.max} (opcional)`}
              value={question.maxLabel ?? ""}
              onChange={handleChange("maxLabel")}
            />
          </>
        );
      case SLIDERMOJI:
        return (
          <>
            <Box>
              <FormLabel component="legend">Elige un emoji</FormLabel>
              {emojis.map((emoji, i) => (
                <EmojiButton emoji={emoji.url} key={i} />
              ))}
            </Box>
          </>
        );
      default:
        return null;
    }
  }, [debouncedSave, question, setQuestions]);
};

export default Options;
