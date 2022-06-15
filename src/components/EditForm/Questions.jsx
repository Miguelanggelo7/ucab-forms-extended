import { useMemo } from "react";
import { Box, Fab, Stack, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import { defaultQuestion } from "../../constants/questions";
import { useForm } from "../../hooks/useForm";
import { insertQuestion } from "../../api/questions";
import QuestionPreview from "./QuestionPreview";
import { calculateNewIndex } from "../../utils/questions";
import { motion } from "framer-motion";
import Fade from "react-reveal/Fade";

const Questions = ({ setOpenDrawer }) => {
  const { form, questions, current, setCurrent } = useForm();

  return useMemo(() => {
    const addQuestion = () => {
      const newIndex = calculateNewIndex(questions, current);

      const newQuestion = { index: newIndex, ...defaultQuestion };

      const questionId = insertQuestion(form.id, newQuestion);

      setCurrent(questionId);
      setOpenDrawer(true);
    };

    return (
      <Box>
        <Fade>
          <Stack spacing={2}>
            {questions.map((question, i) => (
              <QuestionPreview
                key={i}
                question={question}
                setOpenDrawer={setOpenDrawer}
              />
            ))}
          </Stack>
        </Fade>
        <Tooltip title="Agregar pregunta" arrow>
          <motion.button
            style={{
              position: "fixed",
              bottom: "8%",
              right: "5%",
              background: "none",
              border: "none",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Fab color="primary" onClick={addQuestion}>
              <Add />
            </Fab>
          </motion.button>
        </Tooltip>
      </Box>
    );
  }, [current, form.id, questions, setCurrent, setOpenDrawer]);
};

export default Questions;
