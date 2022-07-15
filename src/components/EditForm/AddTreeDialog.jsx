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
import { useForm } from "../../hooks/useForm";
import { useSnackbar } from "notistack";
import { addTree } from "../../api/trees";

const DialogBody = ({ closeDialog, data }) => {
  const [title, setTitle] = useState("");
  const { treeId } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  const createNewTree = async () => {
    const { error } = await addTree(treeId, data.id, title);
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
        Nueva Sección
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
          label={"Nombre de la sección"}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={createNewTree}>Añadir</Button>
      </DialogActions>
    </>
  );
};

const AddTreeDialog = ({ open, setOpen, data }) => {
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

export default AddTreeDialog;
