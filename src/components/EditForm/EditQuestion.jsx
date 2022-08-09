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
  useMediaQuery,
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
  IMAGE,
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
import { Divider } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImageButton from "../ImageButton";
import { deleteFile, uploadFiles } from "../../api/storage";
import { useTheme } from "@mui/material/styles";

const EditQuestion = ({ setOpenDrawer }) => {
  const { form, questions, setQuestions, current, setCurrent, responses } =
    useForm();
  const openAlert = useAlert();
  const { restrictionsList } = useRestrictions();

  const theme = useTheme();
  const upXs = useMediaQuery(theme.breakpoints.up("xs"));

  const arrayValues = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];

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

    const handleChangeImage = async (files, i) => {
      if (!files) {
        try {
          await deleteFile(
            `${question.image[i].date}${question.image[i].name}`
          );

          const newQuestion = { ...question };

          newQuestion.image = newQuestion.image.filter(
            (_, index) => index !== i
          );

          debouncedSave(newQuestion);
          setQuestions((questions) =>
            questions.map((q) => (q.id === question.id ? newQuestion : q))
          );
          return;
        } catch (err) {}
      }

      try {
        const filesSaved = await uploadFiles([...files]);
        const newQuestion = { ...question };
        newQuestion.image.push(...filesSaved);
        debouncedSave(newQuestion);

        setQuestions((questions) =>
          questions.map((q) => (q.id === question.id ? newQuestion : q))
        );
      } catch (err) {}
    };

    const handleArrayChange = (type, i) => (e) => {
      const value = e.target.value;
      console.log(i);
      const titles = {
        rows: [...question.titles.rows],
        columns: [...question.titles.columns],
      };

      if (typeof i === "undefined") {
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
      } else titles[type][i] = value;

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

      if (type === IMAGE) {
        newQuestion.multipleImages = false;
      } else {
        newQuestion.multipleImages = null;
      }

      if (type === RATING) {
        newQuestion.typeRating = "star";
      } else {
        newQuestion.typeRating = null;
      }

      if (type === ARRAY) {
        newQuestion.arrayType = arrayOptions[0].value;
        newQuestion.titles = {
          rows: ["Fila 1", "Fila 2", "Fila 3"],
          columns: ["Columna 1", "Columna 2", "Columna 3"],
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

      if (field === "descriptionCheck" && !checked) {
        newQuestion.description = "";
      }

      if (field === "restricted" && checked) {
        newQuestion.restrictions = [""];
      }

      debouncedSave(newQuestion);

      setQuestions((questions) =>
        questions.map((q) => (q.id === question.id ? newQuestion : q))
      );
    };

    const removeQuestion = (questionId) => {
      const textMessage = disableEditArrayTable()
        ? "Al eliminar esta pregunta eliminarás todas sus respuestas ¿estás seguro de eliminarla?"
        : "¿Estás seguro de eliminar esta pregunta?";
      openAlert({
        title: "Eliminar pregunta",
        message: textMessage,
        action: () => {
          deleteQuestion(form.id, questionId);
          setOpenDrawer(false);
        },
      });
    };

    if (!question) {
      return (
        <Box
          sx={{
            marginTop: upXs ? "0" : "50pt",
          }}
        >
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

    const disableEditArrayTable = () => {
      let shouldCheckDisable = false;

      responses.forEach((r) => {
        const answer = r.answers[question.id];
        if (answer || answer === 0) {
          shouldCheckDisable = true;
        }
      });
      return shouldCheckDisable;
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
            marginTop: upXs ? "0" : "50pt",
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
                disabled={disableEditArrayTable()}
              >
                {arrayOptions.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
              <Box
                sx={{
                  display: "inline-flex",
                  width: "100%",
                  marginTop: "15pt",
                }}
              >
                <div style={{ width: "45%", marginRight: "10%" }}>
                  <TextField
                    select
                    fullWidth
                    variant="standard"
                    label="Filas"
                    value={question.titles.rows.length || 3}
                    onChange={handleArrayChange("rows")}
                    disabled={disableEditArrayTable()}
                  >
                    {arrayValues.map((n) => (
                      <MenuItem key={n} value={n}>
                        {n}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div style={{ width: "45%" }}>
                  <TextField
                    select
                    fullWidth
                    variant="standard"
                    label="Columnas"
                    value={question.titles.columns.length || 3}
                    onChange={handleArrayChange("columns")}
                    disabled={disableEditArrayTable()}
                  >
                    {arrayValues.map((n) => (
                      <MenuItem key={n} value={n}>
                        {n}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </Box>
              <Box sx={{ marginTop: "15pt", marginBottom: "15pt" }}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Filas</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {question.titles.rows.map((title, i) => (
                      <div style={{ marginTop: "10pt", marginBottom: "10pt" }}>
                        <TextField
                          fullWidth
                          variant="standard"
                          value={title}
                          onChange={handleArrayChange("rows", i)}
                        />
                      </div>
                    ))}
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography>Columnas</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {question.titles.columns.map((title, i) => (
                      <div style={{ marginTop: "10pt", marginBottom: "10pt" }}>
                        <TextField
                          fullWidth
                          variant="standard"
                          value={title}
                          onChange={handleArrayChange("columns", i)}
                        />
                      </div>
                    ))}
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
          )}
          <Box>
            <ImageButton
              fullWidth
              text
              multiple
              inputId={question.id + "-edit"}
              onChange={(image) => handleChangeImage(image)}
            />
            {question.image &&
              question.image.map((image, i) => (
                <>
                  <Box
                    key={image.date + image.name}
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <Typography noWrap>{image.name}</Typography>
                    <Tooltip title="Eliminar" arrow>
                      <IconButton onClick={() => handleChangeImage(null, i)}>
                        <ClearIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </>
              ))}
          </Box>
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
          {question.type === IMAGE && (
            <Box>
              <FormControlLabel
                control={<Checkbox />}
                checked={question.multipleImages}
                onChange={handleChangeChecked("multipleImages")}
                label="Múltiples imágenes"
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
              disabled={question.type === SORTABLE}
              checked={question.descriptionCheck}
              onChange={handleChangeChecked("descriptionCheck")}
              label="Agregar descripción"
            />
          </Box>
          {question.descriptionCheck && (
            <Box>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Descripción"
                value={question.description}
                onChange={handleChange("description")}
              />
            </Box>
          )}
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
    upXs,
  ]);
};

export default EditQuestion;
