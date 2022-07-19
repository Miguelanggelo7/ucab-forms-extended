import { Box, TextField } from "@mui/material";
import debounce from "lodash.debounce";
import React, { useMemo } from "react";
import { saveQuestion } from "../api/questions";
import { CHECKBOX, RADIO, TEXT } from "../constants/questions";
import { useForm } from "../hooks/useForm";

const ArrayTable = ({ question }) => {
  const { form } = useForm();

  const debouncedSave = useMemo(
    () =>
      debounce((newQuestion) => {
        saveQuestion(form.id, newQuestion);
      }, 1500),
    [form.id]
  );

  const renderRowText = () => {};

  const renderRowCheckBox = () => {};

  const renderRowRadio = () => {};

  const renderTable = () => {
    /*
      title's object
      {
        rows: ["fila 1", "fila 2", "fila 3"],
        columns: ["columna 1", "columna 2", "columna 3"]
      }
    */
    if (question.type === TEXT) return renderRowText();
    if (question.type === CHECKBOX) return renderRowCheckBox();
    if (question.type === RADIO) return renderRowRadio();
  };

  const handleChangeTitle = (type, i) => (_, value) => {
    const newQuestion = { ...question };

    console.log(question);
  };

  return (
    <Box sx={{ display: "inline-flex" }}>
      <Box sx={{ marginRight: "5pt", paddingTop: "20pt" }}>
        {/* falta estilizar xd */}
        {question.titles.rows.map((label, i) => (
          <p
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              marginRight: "10pt",
            }}
          >
            {label}
          </p>
        ))}
      </Box>
      <Box sx={{ display: "inline-flex" }}>
        {question.titles.columns.map((label, i) => (
          <>
            <p
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                marginRight: "10pt",
              }}
            >
              {label}
            </p>
          </>
        ))}
      </Box>
    </Box>
  );
};

export default ArrayTable;
