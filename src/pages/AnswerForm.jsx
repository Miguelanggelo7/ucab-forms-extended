import { useCallback, useEffect, useState, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getFormOnce } from "../api/forms";
import { submitResponse, checkUserHasResponses } from "../api/responses";
import {
  CHECKBOX,
  FILE,
  RADIO,
  RATING,
  SLIDER,
  SORTABLE,
  VOICE,
  IMAGE,
  ARRAY,
  TEXT,
} from "../constants/questions";
import { useUser } from "../hooks/useUser";
import Header from "../components/Header";
import Question from "../components/Question";
import AnswerPageText from "../components/AnswerPageText";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getFormRestrictions } from "../api/restrictions";
import RestrictionStep from "../components/RestrictionStep";
import { useFont } from "../hooks/useFont";
import Lottie from "lottie-react";
import errorStep from "../img/errorstep.json";

const AnswerForm = () => {
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [response, setResponse] = useState({});
  const [errors, setErrors] = useState({});
  const [answers, setAnswers] = useState();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userHasResponses, setUserHasResponses] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useUser();
  const [restrictions, setRestrictions] = useState([]);
  const [arrayRestValidated, setArrayRestValidated] = useState([]);
  const [stepper, setStepper] = useState(false);
  const [cardShowed, setCardShowed] = useState(false);
  const [colorForm, setColorForm] = useState("#4B7ABC");

  const { font } = useFont();

  const initializeAnswers = useCallback((questions) => {
    const answers = {};

    questions.forEach((question) => {
      if (
        question.type === CHECKBOX ||
        question.type === FILE ||
        question.type === IMAGE
      ) {
        answers[question.id] = [];
      } else if (question.type === RADIO && question.required) {
        answers[question.id] = question.options[0];
      } else if (question.type === SLIDER) {
        answers[question.id] = question.min;
      } else if (question.type === SORTABLE) {
        answers[question.id] = [...question.options];
      } else if (question.type === RATING) {
        answers[question.id] = 0;
      } else if (question.type === VOICE) {
        answers[question.id] = [];
        answers[question.id + "-text"] = "";
      } else if (question.type === ARRAY) {
        answers[question.id] = {};
        question.titles.rows.forEach((_, i) => {
          question.titles.columns.forEach((_, j) => {
            answers[question.id][`${i}:${j}`] =
              question.arrayType === TEXT ? "" : false;
          });
        });
      } else {
        answers[question.id] = "";
      }
    });

    setAnswers(answers);
  }, []);

  useEffect(() => {
    const randomizeOptionsOrder = (questions) => {
      questions.forEach((question) => {
        if (question.randomOrder) {
          question.options.sort(() => Math.random() - 0.5);
        }
      });
    };

    const getForm = async () => {
      const form = await getFormOnce(formId);
      if (form) {
        const restrictions = await getFormRestrictions(form.questions);
        setRestrictions(restrictions);

        setColorForm(form.settings.color);

        if (form.settings.onlyOneResponse && !user) {
          setForm(form);
          return setLoading(false);
        }

        randomizeOptionsOrder(form.questions);

        if (form.settings.randomOrder) {
          form.questions.sort(() => Math.random() - 0.5);
        }

        if (form.settings.onlyOneResponse) {
          const hasResponses = await checkUserHasResponses(form.id, user.id);

          setUserHasResponses(hasResponses);
        }

        setForm(form);
        initializeAnswers(form.questions);

        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setResponse((response) => ({
            ...response,
            location: { latitude, longitude },
          }));
        });
      }
      setLoading(false);
    };

    getForm();
  }, [formId, initializeAnswers, user]);

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: font.family,
        },
        components: {
          MuiInputLabel: {
            styleOverrides: {
              root: {
                fontSize: font.size,
              },
            },
          },
          MuiInput: {
            styleOverrides: {
              root: {
                fontSize: font.size,
              },
            },
          },
          MuiFormControlLabel: {
            styleOverrides: {
              label: {
                fontSize: `${font.size}px`,
              },
            },
          },
          MuiFormLabel: {
            styleOverrides: {
              root: {
                fontSize: `${font.size}px`,
              },
            },
          },
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: "#fafafa",
              },
            },
          },
        },
        palette: {
          primary: {
            main: colorForm,
          },
        },
      }),
    [font, colorForm]
  );

  const submit = async (e) => {
    e.preventDefault();

    let shouldReturn = false;
    const newErrors = { ...errors };

    form.questions.forEach((question) => {
      if (question.required) {
        if (
          ((question.type === CHECKBOX ||
            question.type === FILE ||
            question.type === IMAGE) &&
            !answers[question.id].length) ||
          (question.type === RATING && !answers[question.id])
        ) {
          newErrors[question.id] = true;
          shouldReturn = true;
        } else {
          newErrors[question.id] = false;
        }
      }
    });

    setErrors(newErrors);

    if (shouldReturn) {
      return enqueueSnackbar("Aún tienes preguntas por responder", {
        variant: "error",
      });
    }

    setSubmitting(true);

    const responseData = {
      ...response,
      answers: { ...answers },
      comments: {},
    };

    if (form.settings.onlyOneResponse) {
      responseData.user = { ...user };
    }

    const { error } = await submitResponse(form, responseData, user);

    if (error) {
      enqueueSnackbar(error.message, { variant: "error" });
      return setSubmitting(false);
    }

    navigate(`/forms/answer/${formId}/sent`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          margin: "auto",
          width: "30pt",
          marginTop: "50pt",
        }}
      >
        <CircularProgress sx={{ margin: "auto" }} />
      </Box>
    );
  }

  if (!form) {
    return <AnswerPageText>No se encontró la encuesta</AnswerPageText>;
  }

  if (!form.settings.allowResponses) {
    return <AnswerPageText>Esta encuesta no admite respuestas</AnswerPageText>;
  }

  if (
    form.settings.maxResponses &&
    form.responses >= form.settings.maxResponses
  ) {
    return (
      <AnswerPageText>Esta encuesta ya no admite más respuestas</AnswerPageText>
    );
  }

  if (form.settings.startDate && form.settings.startDate > new Date()) {
    return (
      <AnswerPageText>Esta encuesta aún no está disponible</AnswerPageText>
    );
  }

  if (form.settings.endDate && form.settings.endDate < new Date()) {
    return <AnswerPageText>Esta encuesta ya no está disponible</AnswerPageText>;
  }

  if (form.settings.onlyOneResponse) {
    if (!user) {
      return (
        <AnswerPageText>
          Debes estar registrado para responder esta encuesta
        </AnswerPageText>
      );
    }

    if (userHasResponses) {
      return <AnswerPageText>Ya has respondido esta encuesta</AnswerPageText>;
    }
  }

  const showQuestion = (question) => {
    if (question.restricted) {
      let checker = (arr, target) => target.every((v) => arr.includes(v));
      return checker(arrayRestValidated, question.restrictions);
    }
    return true;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Header />
        {restrictions.length < 1 || stepper ? (
          <Container sx={{ p: 3 }} maxWidth="md">
            <form onSubmit={submit}>
              <Stack spacing={2}>
                <Card sx={{ p: 3 }} variant="outlined">
                  <Typography variant="h5" mb={2}>
                    {form.title}
                  </Typography>
                  <Typography mb={2}>{form.description}</Typography>
                  {cardShowed ? (
                    <Typography color="error" variant="caption">
                      * Obligatorio
                    </Typography>
                  ) : null}
                </Card>
                {form.questions.map((question, i) =>
                  showQuestion(question) === true || restrictions.length < 1
                    ? (cardShowed ? null : setCardShowed(true),
                      (
                        <Card key={i} sx={{ p: 3 }} variant="outlined">
                          <Question
                            question={question}
                            answers={answers}
                            setAnswers={setAnswers}
                            paletteColor={form.settings.color}
                          />
                          {errors[question.id] && (
                            <Alert
                              variant="outlined"
                              severity="error"
                              sx={{ mt: 3, border: "none", p: 0 }}
                            >
                              Esta pregunta es requerida
                            </Alert>
                          )}
                        </Card>
                      ))
                    : null
                )}
              </Stack>
              {cardShowed ? (
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                    justifyContent: { sm: "space-between" },
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: { sm: 1 }, mr: { sm: 2 } }}
                  >
                    Nunca envíes contraseñas a través de UCAB Forms
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexShrink: 0,
                      alignItems: "center",
                      mb: { xs: 2, sm: 0 },
                    }}
                  >
                    <Button
                      sx={{ px: 1, mr: 2 }}
                      onClick={() => initializeAnswers(form.questions)}
                    >
                      Borrar respuestas
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      variant="contained"
                      sx={{ px: 5 }}
                    >
                      Enviar
                    </Button>
                  </Box>
                </Box>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <Typography variant="h4" sx={{ marginTop: "20pt" }}>
                    Lo sentimos...
                  </Typography>
                  <Lottie
                    animationData={errorStep}
                    loop={false}
                    style={{
                      width: "100%",
                      maxWidth: "300pt",
                      margin: "auto",
                      marginTop: "-15pt",
                      marginBottom: "10pt",
                    }}
                  />
                  <Typography variant="body2" sx={{ marginBottom: "10pt" }}>
                    No cumples con las condiciones necesarias para realizar esta
                    encuesta.
                  </Typography>
                </div>
              )}
            </form>
          </Container>
        ) : (
          <RestrictionStep
            restrictions={restrictions}
            setArray={setArrayRestValidated}
            array={arrayRestValidated}
            setShow={setStepper}
          />
        )}
      </Box>
    </ThemeProvider>
  );
};

export default AnswerForm;
