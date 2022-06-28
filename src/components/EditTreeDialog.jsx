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
  TextField,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useAlert } from "../hooks/useAlert";
import { useSnackbar } from "notistack";

const DialogBody = ({ closeDialog, tree }) => {
  const [title, setTitle] = useState(tree.title);
  const { enqueueSnackbar } = useSnackbar();
  const openAlert = useAlert();

  const handleDelete = (event) => {
    openAlert({
      title: "Eliminar sección",
      message: "¿Estás seguro de eliminar esta sección?",
      action: () => {
        console.log(tree.treeId);

        enqueueSnackbar("Sección eliminada", {
          variant: "success",
        });
      },
    });
  };

  return useMemo(() => {
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
          <Button>Guardar</Button>
        </DialogActions>
      </>
    );
  });
};

const EditTreeDialog = ({ open, setOpen, tree }) => {
  const fullScreen = useMediaQuery("(max-width:320pt)");
  const openAlert = useAlert();

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
        <DialogBody closeDialog={closeDialog} tree={tree} />
      </Dialog>
    </>
  );
};

export default EditTreeDialog;
