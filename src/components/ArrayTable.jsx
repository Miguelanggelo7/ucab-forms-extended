import { TheatersRounded } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { TextField } from "@mui/material";
import React from "react";
import { saveQuestion } from "../api/questions";
import { CHECKBOX, RADIO, TEXT } from "../constants/questions";
import Checkbox from "@mui/material/Checkbox";

const ArrayTable = ({ question, disabled }) => {
  return (
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
        bordercolor={disabled ? "#c4c4c4" : "#000000"}
        style={{
          width: "100%",
          textAlign: "center",
          borderCollapse: "collapse",
        }}
      >
        <tr>
          <th style={{ minWidth: "50pt", backgroundColor: "#f5f5f5" }}></th>
          {question.titles.columns.map((label, i) => (
            <th
              style={{
                minWidth: "100pt",
                fontWeight: "normal",
                backgroundColor: "#f5f5f5",
              }}
            >
              <p
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  marginRight: "10pt",
                  color: disabled ? "#c4c4c4" : "#000000",
                }}
              >
                {label}
              </p>
            </th>
          ))}
        </tr>

        {question.titles.rows.map((label, i) => (
          <>
            <tr>
              <td
                style={{
                  minWidth: "100pt",
                  fontWeight: "normal",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <p
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    marginRight: "10pt",
                    color: disabled ? "#c4c4c4" : "#000000",
                  }}
                >
                  {label}
                </p>
              </td>
              {question.titles.columns.map((label, j) => (
                <td
                  style={{
                    minWidth: "100pt",
                    fontWeight: "normal",
                  }}
                >
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      marginRight: "10pt",
                    }}
                  >
                    {question.arrayType === TEXT ? (
                      <TextField
                        fullWidth
                        disabled={disabled}
                        onChange={() => console.log(i + " /" + j)}
                        sx={{
                          margin: "5pt",
                        }}
                      />
                    ) : (
                      <Checkbox disabled={disabled} />
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </>
        ))}
      </table>
    </div>
  );
};

export default ArrayTable;
