import { useMemo } from "react";
import { Card, IconButton, Tooltip, Typography } from "@mui/material";
import { useForm } from "../../hooks/useForm";
import AllQuestionsPreview from "../AllQuestionsPreview";
import RequiredMark from "../RequiredMark";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { motion } from "framer-motion";

const EditQuestion = ({ question, setOpenDrawer }) => {
  const { current, setCurrent } = useForm();

  return useMemo(() => {
    const handleClick = () => {
      setCurrent(question.id);
      setOpenDrawer(true);
    };

    return (
      <motion.div
        whileHover={{ scale: question.id === current ? 1 : 1.02 }}
        whileTap={{ scale: question.id === current ? 1 : 0.98 }}
      >
        <Card
          sx={{ p: 3, cursor: "pointer" }}
          onClick={handleClick}
          elevation={question.id === current ? 5 : 0}
          variant={question.id === current ? "elevation" : "outlined"}
        >
          <div style={{ maxWidth: "90%", wordWrap: "break-word" }}>
            <Typography mb={2}>
              {question.title}
              <RequiredMark question={question} />
              <br />
              <Typography variant="caption">{question.description}</Typography>
            </Typography>
          </div>
          <AllQuestionsPreview question={question} />
        </Card>
      </motion.div>
    );
  }, [current, question, setOpenDrawer, setCurrent]);
};

export default EditQuestion;
