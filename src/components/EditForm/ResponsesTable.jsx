import { useMemo } from "react";
import { Link } from "@mui/material";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { format } from "date-fns";
import Table from "../Table";
import { useForm } from "../../hooks/useForm";
import { stringifyAnswers } from "../../utils/stats";
import { ARRAY, FILE, IMAGE, VOICE } from "../../constants/questions";

const ResponsesTable = () => {
  const { responses, questions } = useForm();

  const columns = useMemo(() => {
    return [
      { title: "Fecha de respuesta", field: "submittedAt" },
      { title: "Usuario", field: "username" },
      ...questions
        .map((question) => {
          if (question.type !== ARRAY) {
            return {
              title: question.title,
              field:
                question.type === VOICE ? `${question.id}.text` : question.id,
              emptyValue: "-",
              ...((question.type === FILE || question.type === IMAGE) && {
                render: (rowData) => (
                  <>
                    {rowData[question.id].split(", ").map((url, i) => (
                      <Link
                        key={i}
                        href={url}
                        noWrap
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: "block", maxWidth: "15ch" }}
                      >
                        {url}
                      </Link>
                    ))}
                  </>
                ),
              }),
            };
          }
          return null;
        })
        .filter((p) => p),
    ];
  }, [questions]);

  const data = useMemo(() => {
    console.log(responses);
    return responses.map((response) => ({
      id: response.id,
      submittedAt: format(response.submittedAt, "dd/MM/yyyy HH:mm"),
      username: response.user ? response.user.name : "Anónimo",
      ...stringifyAnswers(response.answers, questions),
    }));
  }, [questions, responses]);

  return useMemo(() => {
    return (
      <Table
        title="Respuestas"
        columns={columns}
        data={data}
        options={{
          exportMenu: [
            {
              label: "Exportar PDF",
              exportFunc: (cols, datas) => ExportPdf(cols, datas, "Respuestas"),
            },
            {
              label: "Exportar CSV",
              exportFunc: (cols, datas) => ExportCsv(cols, datas, "Respuestas"),
            },
          ],
        }}
      />
    );
  }, [columns, data]);
};

export default ResponsesTable;
