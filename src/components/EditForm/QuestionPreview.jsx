import { useMemo } from "react";
import { Card, Typography } from "@mui/material";
import { useForm } from "../../hooks/useForm";
import AllQuestionsPreview from "../AllQuestionsPreview";
import RequiredMark from "../RequiredMark";
import { useFont } from "../../hooks/useFont";

const EditQuestion = ({ question, setOpenDrawer }) => {
  const { current, setCurrent } = useForm();
  const { font } = useFont();
  return useMemo(() => {
    const handleClick = () => {
      setCurrent(question.id);
      setOpenDrawer(true);
    };

    return (
      <Card
        sx={{ p: 3, cursor: "pointer" }}
        onClick={handleClick}
        elevation={question.id === current ? 5 : 0}
        variant={question.id === current ? "elevation" : "outlined"}
      >
        <Typography
          mb={2}
          fontFamily={font.family}
          fontWeight="bold"
          fontSize={`${font.size + 2}px`}
        >
          {question.title}
          <RequiredMark question={question} />
        </Typography>
        <AllQuestionsPreview question={question} />
      </Card>
    );
  }, [current, question, setOpenDrawer, setCurrent]);
};

export default EditQuestion;
