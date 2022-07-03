import { useEffect, useState } from "react";
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
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useForm } from "../../hooks/useForm";
import { useUser } from "../../hooks/useUser";
import { getCollaborationForms, getUserForms } from "../../api/forms";
import { addChild } from "../../api/trees";
import { useSnackbar } from "notistack";

const DialogBody = ({
  closeDialog,
  data,
  userForms,
  collaborationForms,
  user,
  defaultValue,
}) => {
  const { current, setCurrent } = useState(defaultValue);
  const { enqueueSnackbar } = useSnackbar();
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
        <Select variant="standard" fullWidth defaultValue={userForms[0].id}>
          {userForms.length === 0
            ? null
            : userForms.map((form) => (
                <MenuItem id={form.id} value={form.id}>
                  {form.title}
                </MenuItem>
              ))}
          {collaborationForms.length === 0
            ? null
            : collaborationForms.map((form) => (
                <MenuItem id={form.id} value={form.id}>
                  {form.title}
                </MenuItem>
              ))}
          {(userForms.length === collaborationForms.length) === 0 ? (
            <MenuItem value={0} disabled>
              No posee encuestas ni colaboraciones
            </MenuItem>
          ) : null}
        </Select>
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
  const [userForms, setUserForms] = useState([]);
  const [collaborationForms, setCollaborationForms] = useState([]);
  const [loadingUserForms, setLoadingUserForms] = useState(true);
  const [loadingCollaborationForms, setLoadingCollaborationForms] =
    useState(true);
  const user = useUser();

  const defaultCurrentValue = () => {
    return userForms.length === 0
      ? collaborationForms.length === 0
        ? 0
        : collaborationForms[0].id
      : userForms[0].id;
  };

  const closeDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    const unsubscribeUserForms = getUserForms(user.id, (forms) => {
      setUserForms(forms);
      setLoadingUserForms(false);
    });

    const unsubscribeCollaborationForms = getCollaborationForms(
      user,
      (forms) => {
        setCollaborationForms(forms);
        setLoadingCollaborationForms(false);
      }
    );

    return () => {
      unsubscribeUserForms();
      unsubscribeCollaborationForms();
    };
  }, [user]);

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
        {loadingUserForms || loadingCollaborationForms ? (
          <Box
            sx={{
              margin: "auto",
            }}
          >
            <CircularProgress sx={{ margin: "20pt" }} />
          </Box>
        ) : (
          <DialogBody
            closeDialog={closeDialog}
            data={data}
            userForms={userForms}
            collaborationForms={collaborationForms}
            user={user}
            defaultValue={defaultCurrentValue()}
          />
        )}
      </Dialog>
    </>
  );
};

export default AddFormDialog;
