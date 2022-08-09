import { TheatersRounded } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { TextField, Tooltip } from "@mui/material";
import React from "react";
import { saveQuestion } from "../api/questions";
import { CHECKBOX, RADIO, TEXT } from "../constants/questions";
import Checkbox from "@mui/material/Checkbox";

const ArrayTable = ({ question, disabled, answers, setAnswers, isAnswer }) => {
  const handleValueChange = (i, j, value) => {
    const newAnswers = { ...answers };

    newAnswers[question.id][`${i}:${j}`] = value;

    setAnswers(newAnswers);
  };

  return (
    <div
      style={{
        width: "100%",
        overflow: "auto",
        maxHeight: "270pt",
      }}
    >
      {answers ? (
        <table
          border="1"
          cellPadding="0"
          cellSpacing="0"
          bordercolor={disabled ? "#c4c4c4" : "#000000"}
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <tr>
            <th style={{ minWidth: "50pt", backgroundColor: "#f5f5f5" }}></th>
            {question.titles.columns.map((label, i) => (
              <Tooltip title={label}>
                <th
                  style={{
                    minWidth: "100pt",
                    fontWeight: "normal",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <p
                    style={{
                      minWidth: "100pt",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      maxWidth: "150pt",
                      marginRight: "5pt",
                      marginLeft: "5pt",
                      color: disabled ? "#c4c4c4" : "#000000",
                    }}
                  >
                    {label}
                  </p>
                </th>
              </Tooltip>
            ))}
          </tr>

          {question.titles.rows.map((label, i) => (
            <>
              <tr key={`row ${i}`}>
                <Tooltip title={label}>
                  <td
                    style={{
                      fontWeight: "normal",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <p
                      style={{
                        minWidth: "100pt",
                        maxWidth: "150pt",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        marginRight: "5pt",
                        marginLeft: "5pt",
                        color: disabled ? "#c4c4c4" : "#000000",
                      }}
                    >
                      {label}
                    </p>
                  </td>
                </Tooltip>
                {question.titles.columns.map((label, j) => (
                  <td
                    style={{
                      minWidth: "100pt",
                      fontWeight: "normal",
                    }}
                    key={`column ${i}:${j}`}
                  >
                    <div
                      style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        marginRight: "10pt",
                      }}
                    >
                      {question.arrayType === TEXT ? (
                        <div style={{ margin: "5pt", width: "100%" }}>
                          {isAnswer ? (
                            <>
                              {disabled ? (
                                <TextField
                                  fullWidth
                                  value={answers[`${i}:${j}`]}
                                  variant="standard"
                                  disabled
                                />
                              ) : (
                                <TextField
                                  fullWidth
                                  value={answers[question.id][`${i}:${j}`]}
                                  variant="standard"
                                  onChange={(e) =>
                                    handleValueChange(i, j, e.target.value)
                                  }
                                />
                              )}
                            </>
                          ) : (
                            <TextField
                              fullWidth
                              variant="standard"
                              disabled={disabled}
                            />
                          )}
                        </div>
                      ) : isAnswer && answers ? (
                        <>
                          {disabled ? (
                            <Checkbox disabled checked={answers[`${i}:${j}`]} />
                          ) : (
                            <Checkbox
                              checked={answers[question.id][`${i}:${j}`]}
                              onChange={(e) =>
                                handleValueChange(i, j, e.target.checked)
                              }
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <Checkbox disabled />
                        </>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </>
          ))}
        </table>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ArrayTable;
