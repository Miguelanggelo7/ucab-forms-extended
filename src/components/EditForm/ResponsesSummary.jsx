import { useMemo, useRef, useCallback } from "react";
import { Box, Card, Typography, Stack, Button } from "@mui/material";
import { useForm } from "../../hooks/useForm";
import QuestionStat from "./QuestionStat";
import { useCapture } from "react-capture";

const ResponsesSummary = () => {
  const { questions, responses } = useForm();
  const answers = useMemo(() => responses.map((r) => r.answers), [responses]);
  const { snap } = useCapture();
  const element = useRef(null);

  const downloadSummary = useCallback(() => {
    snap(element, { file: `Resumen.png` });
  }, [snap, element]);

  return useMemo(() => {
    return (
      <Box>
        <div
          style={{
            marginTop: "-10pt",
            marginBottom: "10pt",
            display: "inline-flex",
          }}
        >
          <Button onClick={downloadSummary}>Exportar resumen como PNG</Button>
        </div>
        <Stack ref={element} spacing={2}>
          {questions.map((question) => (
            <Card key={question.id} sx={{ p: 3 }} variant="outlined">
              <Typography>{question.title}</Typography>
              <QuestionStat question={question} responses={answers} />
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }, [answers, questions]);
};

export default ResponsesSummary;
