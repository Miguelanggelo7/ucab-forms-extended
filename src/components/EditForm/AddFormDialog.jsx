import { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
  useMediaQuery,
  Select,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useForm } from "../../hooks/useForm";
import { useUser } from "../../hooks/useUser";
import { createForm } from "../../api/forms";
import { addChild } from "../../api/trees";
import { useSnackbar } from "notistack";

const DialogBody = ({ closeDialog, data }) => {
  // const getAllMyForms = useMemo(() => {

  // }, []);
  const { enqueueSnackbar } = useSnackbar();
  const user = useUser();
  const { treeId } = useForm();

  const createNewForm = async () => {
    const { error } = await addChild(user, treeId, data.id);
    error && enqueueSnackbar(error.message, { variant: "error" });
    closeDialog();
  };

  return (
    <>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Añadir una encuesta
        <Tooltip title="Cerrar" arrow>
          <IconButton onClick={closeDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent sx={{ background: "inherit" }}>
        <Select variant="standard" v fullWidth />
        <Button
          fullWidth
          sx={{ marginBottom: "-10pt", marginTop: "10pt" }}
          onClick={createNewForm}
        >
          Crear una encuesta
        </Button>
      </DialogContent>
      <DialogActions>
        <Button>Añadir</Button>
      </DialogActions>
    </>
  );
};

const AddFormDialog = ({ open, setOpen, data }) => {
  const fullScreen = useMediaQuery("(max-width:320pt)");

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={closeDialog}
        fullScreen={fullScreen}
        fullWidth
        sx={{ maxWidth: "320pt", margin: "auto" }}
        keepMounted={false}
      >
        <DialogBody closeDialog={closeDialog} data={data} />
      </Dialog>
    </>
  );
};

export default AddFormDialog;
