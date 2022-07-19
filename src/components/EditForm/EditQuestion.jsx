import { useMemo, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Button,
  Autocomplete,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  ContentCopy,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Lottie from "lottie-react";
import debounce from "lodash.debounce";
import {
  compatibility,
  questionTypes,
  arrayOptions,
  CHECKBOX,
  FILE,
  RADIO,
  SELECT,
  SORTABLE,
  SLIDER,
  TEXT,
  TEXTAREA,
  SLIDERMOJI,
  RATING,
  ARRAY,
} from "../../constants/questions";
import {
  deleteQuestion,
  insertQuestion,
  saveQuestion,
} from "../../api/questions";
import { useForm } from "../../hooks/useForm";
import { useAlert } from "../../hooks/useAlert";
import EditOptions from "./EditOptions";
import { calculateNewIndex } from "../../utils/questions";
import selectAnimation from "../../img/select.json";
import { Clear as ClearIcon } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import RestrictionDialog from "../RestrictionDialog";
import { useRestrictions } from "../../hooks/useRestriction";

const EditQuestion = ({ setOpenDrawer }) => {
  const { form, questions, setQuestions, current, setCurrent, responses } =
    useForm();
  const openAlert = useAlert();
  const { restrictionsList } = useRestrictions();

  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);
  const [openResDialog, setOpenResDialog] = useState(false);

  const question = useMemo(() => {
    return questions.find((q) => q.id === current);
  }, [questions, current]);

  const debouncedSave = useMemo(
    () =>
      debounce((newQuestion) => {
        saveQuestion(form.id, newQuestion);
      }, 1500),
    [form.id]
  );

  return useMemo(() => {
    const needsOptions = (type) => {
      return [RADIO, CHECKBOX, SELECT, SORTABLE].includes(type);
    };

    const handleChange = (field) => (e) => {
      const value = e.target.value;

      const newQuestion = { ...question, [field]: value };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const handleArraySizeChange = (type) => (e) => {
      const value = e.target.value;
      const titles = {
        rows: [...question.titles.rows],
        columns: [...question.titles.columns],
      };

      if (titles[type].length > value) {
        const newData = titles[type].filter((_, i) => i < value);
        console.log(newData);
        titles[type] = [...newData];
      }

      if (titles[type].length < value) {
        for (let length = titles[type].length + 1; length <= value; length++)
          titles[type].push(
            `${type === "rows" ? "Fila" : "Columna"} ${length}`
          );
      }

      const newQuestion = { ...question, titles };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const handleChangeRestriction = (i) => (_, value) => {
      const restriction = value.label;

      const restrictions = [...question.restrictions];
      restrictions[i] = restriction;

      const newQuestion = { ...question, restrictions };
      console.log(question);
      console.log(restrictionsList);
      debouncedSave(newQuestion);
      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const addRestriction = () => {
      const newQuestion = {
        ...question,
        restrictions: [...question.restrictions, ""],
      };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const deleteRestriction = (i) => () => {
      const restrictions = [...question.restrictions];
      if (restrictions.length !== 1) {
        restrictions.splice(i, 1);

        const newQuestion = { ...question, restrictions };

        debouncedSave(newQuestion);

        setQuestions((questions) =>
          questions.map((q) => (q.id === question.id ? newQuestion : q))
        );
      }
    };

    const handleChangeType = (e) => {
      const type = e.target.value;

      const newQuestion = { ...question, type };

      if (!needsOptions(type)) {
        newQuestion.options = null;
        newQuestion.randomOrder = null;
      }

      if (!newQuestion.options && needsOptions(type)) {
        newQuestion.options = ["Opción 1"];
        newQuestion.randomOrder = false;
      }

      const needsOther = [RADIO, CHECKBOX].includes(type);

      if (!needsOther) {
        newQuestion.other = null;
      }

      if (newQuestion.other === null && needsOther) {
        newQuestion.other = false;
      }

      if (type === TEXT || type === TEXTAREA) {
        newQuestion.specialType = "";
      } else {
        newQuestion.specialType = null;
      }

      if (type === SLIDER) {
        newQuestion.min = 1;
        newQuestion.max = 5;
      } else {
        newQuestion.min = null;
        newQuestion.max = null;
        newQuestion.minLabel = null;
        newQuestion.maxLabel = null;
      }

      if (type === SLIDERMOJI) {
        newQuestion.urlEmoji = "https://twemoji.maxcdn.com/2/72x72/1f600.png";
      } else {
        newQuestion.urlEmoji = null;
      }

      if (type === SORTABLE) {
        newQuestion.required = true;
      }

      if (type === FILE) {
        newQuestion.multipleFiles = false;
      } else {
        newQuestion.multipleFiles = null;
      }

      if (type === RATING) {
        newQuestion.typeRating = "star";
      } else {
        newQuestion.typeRating = null;
      }

      if (type === ARRAY) {
        newQuestion.arrayType = arrayOptions[0].value;
        newQuestion.titles = {
          rows: ["Fila 1"],
          columns: ["Columna 1"],
        };
      } else {
        newQuestion.arrayType = null;
        newQuestion.titles = null;
      }

      console.log(type);

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const handleChangeChecked = (field) => (e) => {
      const checked = e.target.checked;

      const newQuestion = { ...question, [field]: checked };

      if (field === "restricted" && checked) {
        newQuestion.restrictions = [""];
      }

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const removeQuestion = (questionId) => {
      openAlert({
        title: "Eliminar pregunta",
        message: "¿Estás seguro de eliminar esta pregunta?",
        action: () => {
          deleteQuestion(form.id, questionId);
          setOpenDrawer(false);
        },
      });
    };

    if (!question) {
      return (
        <Box>
          <Box sx={{ width: "65%", mx: "auto" }}>
            <Lottie animationData={selectAnimation} loop />
          </Box>
          <Typography align="center">
            No hay pregunta seleccionada. ¡Haz click en una para comenzar a
            editar!
          </Typography>
        </Box>
      );
    }

    const swapQuestion = (direction) => {
      const i = questions.indexOf(question);
      const j = direction === "up" ? i - 1 : i + 1;
      const k = direction === "up" ? i - 2 : i + 2;

      let newIndex;

      if (!questions[k]) {
        newIndex = questions[j].index + (direction === "up" ? -1 : 1);
      } else {
        newIndex = (questions[j].index + questions[k].index) / 2;
      }

      const newQuestion = { ...question, index: newIndex };

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const duplicateQuestion = (question) => {
      const newIndex = calculateNewIndex(questions, question.id);
      const { id, ...questionData } = question;

      questionData.index = newIndex;

      const newQuestionId = insertQuestion(form.id, questionData);

      setCurrent(newQuestionId);
      setOpenDrawer(true);
    };

    const disableType = (type) => {
      let shouldCheckDisable = false;

      responses.forEach((r) => {
        const answer = r.answers[question.id];
        if (answer || answer === 0) {
          shouldCheckDisable = true;
        }
      });

      if (!shouldCheckDisable) {
        return false;
      }

      return !compatibility[question.type].includes(type);
    };

    const verificationRestrictionList = (value) => {
      if (question.restrictions.indexOf(value) > -1) {
        return false;
      } else {
        return true;
      }
    };

    return (
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Editar pregunta</Typography>
          <Box>
            <Tooltip title="Mover arriba" arrow>
              <span>
                <IconButton
                  disabled={question === questions[0]}
                  onClick={() => swapQuestion("up")}
                >
                  <ArrowUpward />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Mover abajo" arrow>
              <span>
                <IconButton
                  disabled={question === questions[questions.length - 1]}
                  onClick={() => swapQuestion("down")}
                >
                  <ArrowDownward />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
        <TextField
          variant="standard"
          multiline
          label="Título de la pregunta"
          value={question.title}
          onChange={handleChange("title")}
        />
        <TextField
          variant="standard"
          select
          label="Tipo de pregunta"
          value={question.type}
          onChange={handleChangeType}
        >
          {questionTypes.map((type) => (
            <MenuItem
              key={type.value}
              value={type.value}
              disabled={disableType(type.value)}
            >
              {type.label}
            </MenuItem>
          ))}
        </TextField>
        <EditOptions question={question} debouncedSave={debouncedSave} />
        <Box>
          {question.type === ARRAY && (
            <Box>
              <TextField
                variant="standard"
                select
                value={question.arrayType}
                label="Tipo de matriz"
                onChange={handleChange("arrayType")}
                fullWidth
                sx={{ marginBottom: "20pt" }}
              >
                {arrayOptions.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ display: "inline-flex" }}>
                <TextField
                  type="number"
                  label="Filas"
                  value={question.titles.rows.length || 1}
                  onChange={handleArraySizeChange("rows")}
                  InputProps={{ inputProps: { min: 1 } }}
                />
                <TextField
                  type="number"
                  label="Columnas"
                  value={question.titles.columns.length || 1}
                  onChange={handleArraySizeChange("columns")}
                />
              </Box>
            </Box>
          )}
          {question.type === FILE && (
            <Box>
              <FormControlLabel
                control={<Checkbox />}
                checked={question.multipleFiles}
                onChange={handleChangeChecked("multipleFiles")}
                label="Múltiples archivos"
              />
            </Box>
          )}
          {needsOptions(question.type) && (
            <Box>
              <FormControlLabel
                control={<Checkbox />}
                checked={question.randomOrder}
                onChange={handleChangeChecked("randomOrder")}
                label="Orden aleatorio"
              />
            </Box>
          )}
          <Box>
            <FormControlLabel
              control={<Checkbox />}
              disabled={question.type === SORTABLE}
              checked={question.required}
              onChange={handleChangeChecked("required")}
              label="Obligatoria"
            />
          </Box>
          <Box>
            <FormControlLabel
              control={<Checkbox />}
              checked={question.restricted}
              onChange={handleChangeChecked("restricted")}
              label="Restringida por condición"
            />
          </Box>
          {question.restricted && (
            <Box>
              {question.restrictions &&
                question.restrictions.map((restriction, i) => (
                  <Box
                    sx={{
                      display: "inline-flex",
                      width: "100%",
                    }}
                    key={i}
                  >
                    <Autocomplete
                      fullWidth
                      disablePortal
                      onChange={handleChangeRestriction(i)}
                      id="combo-box-demo"
                      options={restrictionsList.filter((rest) =>
                        verificationRestrictionList(rest.label)
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.label === value
                      }
                      value={restriction}
                      renderInput={(params) => (
                        <TextField
                          sx={{ marginBottom: "10pt" }}
                          variant="standard"
                          {...params}
                          label="Restricción"
                        />
                      )}
                    />
                    <Tooltip
                      sx={{ height: "30pt", marginTop: "10pt" }}
                      title="Eliminar"
                    >
                      <IconButton>
                        <ClearIcon onClick={deleteRestriction(i)} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              <Button fullWidth onClick={addRestriction}>
                Agregar Restricción
              </Button>
              <Button fullWidth onClick={() => setOpenResDialog(true)}>
                Crear Restricción
              </Button>
            </Box>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Tooltip title="Duplicar pregunta" arrow>
              <IconButton onClick={() => duplicateQuestion(question)}>
                <ContentCopy />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar pregunta" arrow>
              <IconButton onClick={() => removeQuestion(question.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <RestrictionDialog open={openResDialog} setOpen={setOpenResDialog} />
      </Stack>
    );
  }, [
    debouncedSave,
    form.id,
    openAlert,
    question,
    questions,
    responses,
    setCurrent,
    setOpenDrawer,
    setQuestions,
    openResDialog,
    setOpenResDialog,
    restrictionsList,
  ]);
};

export default EditQuestion;
