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
  CHECKBOX,
  FILE,
  RADIO,
  SELECT,
  SORTABLE,
  SLIDER,
  TEXT,
  TEXTAREA,
  SLIDERMOJI,
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
import { useFont } from "../../hooks/useFont";
import { Clear as ClearIcon } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import RestrictionDialog from "../RestrictionDialog";

const EditQuestion = ({ setOpenDrawer }) => {
  const { form, questions, setQuestions, current, setCurrent, responses } =
    useForm();
  const openAlert = useAlert();
  const { font } = useFont();

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

  const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
    { label: "The Dark Knight", year: 2008 },
    { label: "12 Angry Men", year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: "Pulp Fiction", year: 1994 },
    {
      label: "The Lord of the Rings: The Return of the King",
      year: 2003,
    },
    { label: "The Good, the Bad and the Ugly", year: 1966 },
    { label: "Fight Club", year: 1999 },
    {
      label: "The Lord of the Rings: The Fellowship of the Ring",
      year: 2001,
    },
    {
      label: "Star Wars: Episode V - The Empire Strikes Back",
      year: 1980,
    },
    { label: "Forrest Gump", year: 1994 },
    { label: "Inception", year: 2010 },
    {
      label: "The Lord of the Rings: The Two Towers",
      year: 2002,
    },
    { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { label: "Goodfellas", year: 1990 },
    { label: "The Matrix", year: 1999 },
    { label: "Seven Samurai", year: 1954 },
    {
      label: "Star Wars: Episode IV - A New Hope",
      year: 1977,
    },
    { label: "City of God", year: 2002 },
    { label: "Se7en", year: 1995 },
    { label: "The Silence of the Lambs", year: 1991 },
    { label: "It's a Wonderful Life", year: 1946 },
    { label: "Life Is Beautiful", year: 1997 },
    { label: "The Usual Suspects", year: 1995 },
    { label: "Léon: The Professional", year: 1994 },
    { label: "Spirited Away", year: 2001 },
    { label: "Saving Private Ryan", year: 1998 },
    { label: "Once Upon a Time in the West", year: 1968 },
    { label: "American History X", year: 1998 },
    { label: "Interstellar", year: 2014 },
    { label: "Casablanca", year: 1942 },
    { label: "City Lights", year: 1931 },
    { label: "Psycho", year: 1960 },
    { label: "The Green Mile", year: 1999 },
    { label: "The Intouchables", year: 2011 },
    { label: "Modern Times", year: 1936 },
    { label: "Raiders of the Lost Ark", year: 1981 },
    { label: "Rear Window", year: 1954 },
    { label: "The Pianist", year: 2002 },
    { label: "The Departed", year: 2006 },
    { label: "Terminator 2: Judgment Day", year: 1991 },
    { label: "Back to the Future", year: 1985 },
    { label: "Whiplash", year: 2014 },
    { label: "Gladiator", year: 2000 },
    { label: "Memento", year: 2000 },
    { label: "The Prestige", year: 2006 },
    { label: "The Lion King", year: 1994 },
    { label: "Apocalypse Now", year: 1979 },
    { label: "Alien", year: 1979 },
    { label: "Sunset Boulevard", year: 1950 },
    {
      label:
        "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
      year: 1964,
    },
    { label: "The Great Dictator", year: 1940 },
    { label: "Cinema Paradiso", year: 1988 },
    { label: "The Lives of Others", year: 2006 },
    { label: "Grave of the Fireflies", year: 1988 },
    { label: "Paths of Glory", year: 1957 },
    { label: "Django Unchained", year: 2012 },
    { label: "The Shining", year: 1980 },
    { label: "WALL·E", year: 2008 },
    { label: "American Beauty", year: 1999 },
    { label: "The Dark Knight Rises", year: 2012 },
    { label: "Princess Mononoke", year: 1997 },
    { label: "Aliens", year: 1986 },
    { label: "Oldboy", year: 2003 },
    { label: "Once Upon a Time in America", year: 1984 },
    { label: "Witness for the Prosecution", year: 1957 },
    { label: "Das Boot", year: 1981 },
    { label: "Citizen Kane", year: 1941 },
    { label: "North by Northwest", year: 1959 },
    { label: "Vertigo", year: 1958 },
    {
      label: "Star Wars: Episode VI - Return of the Jedi",
      year: 1983,
    },
    { label: "Reservoir Dogs", year: 1992 },
    { label: "Braveheart", year: 1995 },
    { label: "M", year: 1931 },
    { label: "Requiem for a Dream", year: 2000 },
    { label: "Amélie", year: 2001 },
    { label: "A Clockwork Orange", year: 1971 },
    { label: "Like Stars on Earth", year: 2007 },
    { label: "Taxi Driver", year: 1976 },
    { label: "Lawrence of Arabia", year: 1962 },
    { label: "Double Indemnity", year: 1944 },
    {
      label: "Eternal Sunshine of the Spotless Mind",
      year: 2004,
    },
    { label: "Amadeus", year: 1984 },
    { label: "To Kill a Mockingbird", year: 1962 },
    { label: "Toy Story 3", year: 2010 },
    { label: "Logan", year: 2017 },
    { label: "Full Metal Jacket", year: 1987 },
    { label: "Dangal", year: 2016 },
    { label: "The Sting", year: 1973 },
    { label: "2001: A Space Odyssey", year: 1968 },
    { label: "Singin' in the Rain", year: 1952 },
    { label: "Toy Story", year: 1995 },
    { label: "Bicycle Thieves", year: 1948 },
    { label: "The Kid", year: 1921 },
    { label: "Inglourious Basterds", year: 2009 },
    { label: "Snatch", year: 2000 },
    { label: "3 Idiots", year: 2009 },
    { label: "Monty Python and the Holy Grail", year: 1975 },
  ];

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

    const handleChangeRestriction = (i) => (e, value) => {
      const restriction = value.label;

      const restrictions = [...question.restrictions];
      restrictions[i] = restriction;

      const newQuestion = { ...question, restrictions };

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
            {console.log(question)}
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
                      options={top100Films}
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
  ]);
};

export default EditQuestion;
