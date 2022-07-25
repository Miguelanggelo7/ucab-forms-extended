import { TheatersRounded } from "@mui/icons-material";
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
    // <Box>
    //   {/* falta estilizar xd */}
    //   {question.titles.rows.map((label, i) => (
    //     <div style={{ backgroundColor: "red" }}>
    //       <p
    //         style={{
    //           whiteSpace: "nowrap",
    //           textOverflow: "ellipsis",
    //           marginRight: "10pt",
    //         }}
    //       >
    //         {label}
    //       </p>
    //     </div>
    //   ))}
    //   {question.titles.columns.map((label, i) => (
    //     <div style={{ backgroundColor: "blue" }}>
    //       <p
    //         style={{
    //           whiteSpace: "nowrap",
    //           textOverflow: "ellipsis",
    //           marginRight: "10pt",
    //         }}
    //       >
    //         {label}
    //       </p>
    //     </div>
    //   ))}
    // </Box>

    <div
      style={{
        width: "100%",
        overflow: "auto",
        maxHeight: "386pt",
      }}
    >
      <table
        border="1"
        cellpadding="0"
        cellspacing="0"
        bordercolor="#000000"
        style={{
          width: "100%",
          textAlign: "center",
          borderCollapse: "collapse",
        }}
      >
        <tr>
          <th style={{ minWidth: "50pt" }}></th>
          {question.titles.columns.map((label, i) => (
            <th style={{ minWidth: "100pt", fontWeight: "normal" }}>
              <p
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  marginRight: "10pt",
                }}
              >
                {label}
              </p>
            </th>
          ))}
        </tr>

        {question.titles.rows.map((label, i) => (
          <tr>
            <td style={{ minWidth: "100pt", fontWeight: "normal" }}>
              <p
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  marginRight: "10pt",
                }}
              >
                {label}
              </p>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default ArrayTable;
