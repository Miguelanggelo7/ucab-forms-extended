import React from "react";
import { useForm } from "../../hooks/useForm";
import { Box, Button, Typography } from "@mui/material";
import { enableSections } from "../../api/trees";
import { useSnackbar } from "notistack";

const Sections = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { tree, form } = useForm();
  console.log(tree);

  const handleEnableSections = () => {
    try {
      const ref = enableSections(form);
      console.log(ref);
      enqueueSnackbar("Secciones habilitadas correctamente", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar("Ocurrió un error al activar las secciones", {
        variant: "error",
      });
    }
  };

  return (
    <Box>
      {form && form.treeId ? (
        <p>Sections</p>
      ) : (
        <Box>
          <Typography>
            Al parecer haz habilitado las secciones para esta encuesta.
          </Typography>
          <Typography>
            Esto te permitira dividir tu encuesta en carpetas y subcarpetas, asi
            como permitirte crear mas encuestas dentro para poder mantener un
            mejor control.
          </Typography>
          <Button variant="contained" onClick={handleEnableSections}>
            Click aqui para habilitarla
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Sections;
