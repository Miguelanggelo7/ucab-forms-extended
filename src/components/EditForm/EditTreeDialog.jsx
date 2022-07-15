import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Tooltip,
  useMediaQuery,
  TextField,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useAlert } from "../../hooks/useAlert";
import { useSnackbar } from "notistack";
import { useForm } from "../../hooks/useForm";
import { updateTitle, deleteTree } from "../../api/trees";

const DialogBody = ({ closeDialog, data }) => {
  const [title, setTitle] = useState(data.title);
  const { enqueueSnackbar } = useSnackbar();
  const openAlert = useAlert();
  const { tree } = useForm();

  const handleDelete = (event) => {
    openAlert({
      title: "Eliminar sección",
      message: "¿Estás seguro de eliminar esta sección?",
      action: async () => {
        const { error, success } = await deleteTree(tree.treeId, data.id);

        error
          ? enqueueSnackbar(error.message, {
              variant: "error",
            })
          : enqueueSnackbar(success.message, {
              variant: "success",
            });

        closeDialog();
      },
    });
  };

  const handleSave = async () => {
    const { error } = await updateTitle(tree.treeId, { ...data, title });
    closeDialog();
    error && enqueueSnackbar(error.message, { variant: "error" });
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
        Editar una sección
        <Tooltip title="Cerrar" arrow>
          <IconButton onClick={closeDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent sx={{ background: "inherit" }}>
        <TextField
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          label={"Nombre de la sección"}
        />
        <Button
          color="error"
          fullWidth
          sx={{ marginBottom: "-10pt", marginTop: "10pt" }}
          onClick={handleDelete}
        >
          Borrar sección
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Guardar</Button>
      </DialogActions>
    </>
  );
};

const EditTreeDialog = ({ open, setOpen, data }) => {
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

export default EditTreeDialog;
