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

const DialogBody = ({ closeDialog, tree }) => {
  const [title, setTitle] = useState(null);

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
          Añadir una sección
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
          <Button>Añadir</Button>
        </DialogActions>
      </>
    );
  });
};

const AddTreeDialog = ({ open, setOpen, tree }) => {
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
        <DialogBody closeDialog={closeDialog} tree={tree} />
      </Dialog>
    </>
  );
};

export default AddTreeDialog;
