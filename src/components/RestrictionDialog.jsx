import { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const DialogBody = ({ closeDialog }) => {
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
          Crear una restricción
          <Tooltip title="Cerrar" arrow>
            <IconButton onClick={() => closeDialog()}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent sx={{ background: "inherit" }}>
          <List sx={{ background: "inherit" }}></List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {}}>Crear</Button>
        </DialogActions>
      </>
    );
  });
};

const RestrictionDialog = ({ open, setOpen }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      keepMounted={false}
    >
      <DialogBody closeDialog={closeDialog} />
    </Dialog>
  );
};

export default RestrictionDialog;
