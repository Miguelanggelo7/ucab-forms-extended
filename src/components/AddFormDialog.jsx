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

const DialogBody = ({ closeDialog, tree }) => {
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
          Añadir una encuesta
          <Tooltip title="Cerrar" arrow>
            <IconButton onClick={closeDialog}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent sx={{ background: "inherit" }}>
          <Select variant="standard" fullWidth />
          <Button fullWidth sx={{ marginBottom: "-10pt", marginTop: "10pt" }}>
            Crear una encuesta
          </Button>
        </DialogContent>
        <DialogActions>
          <Button>Añadir</Button>
        </DialogActions>
      </>
    );
  });
};

const AddFormDialog = ({ open, setOpen, tree }) => {
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

export default AddFormDialog;
