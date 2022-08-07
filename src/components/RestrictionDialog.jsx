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
  TextField,
  Tooltip,
  useMediaQuery,
  FormControl,
  RadioGroup,
  Box,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import { Check, Clear, Close as CloseIcon } from "@mui/icons-material";
import { createRestriction } from "../api/restrictions";
import { useSnackbar } from "notistack";
import { useUser } from "../hooks/useUser";

const DialogBody = ({ closeDialog }) => {
  const dataRestriction = {
    title: "",
    question: "",
    options: [""],
    optionSelected: 0,
    other: false,
  };

  const { enqueueSnackbar } = useSnackbar();
  const [restriction, setRestriction] = useState(dataRestriction);
  const user = useUser();

  const changeValue = (property, value) => {
    setRestriction({ ...restriction, [property]: value });
  };

  const handleChangeRestriction = (i) => (e) => {
    const rest = e.target.value;

    const options = [...restriction.options];
    options[i] = rest;

    const newRestriction = { ...restriction, options };

    setRestriction(newRestriction);
  };

  const addRestriction = () => {
    const newRestriction = {
      ...restriction,
      options: [...restriction.options, ""],
    };

    setRestriction(newRestriction);
  };

  const deleteRestriction = (i) => () => {
    const options = [...restriction.options];
    if (options.length !== 1) {
      options.splice(i, 1);

      const newRestriction = { ...restriction, options };
      if (newRestriction.optionSelected !== 0) {
        newRestriction.optionSelected -= 1;
      }
      setRestriction(newRestriction);
    }
  };

  const handleCreate = async () => {
    try {
      await createRestriction(restriction, user);
      enqueueSnackbar("Restricción creada correctamente", {
        variant: "success",
      });
    } catch (err) {
      console.log(err.message);
      err.message === "restriction title already exists"
        ? enqueueSnackbar("Ya existe una restricción con ese titulo", {
            variant: "error",
          })
        : enqueueSnackbar("Ocurrió un error", {
            variant: "error",
          });
    } finally {
      closeDialog();
    }
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
        Crear una restricción
        <Tooltip title="Cerrar" arrow>
          <IconButton onClick={closeDialog}>
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent sx={{ background: "inherit" }}>
        <List sx={{ background: "inherit", width: "220pt", margin: "auto" }}>
          <ListItem>
            <TextField
              variant="standard"
              fullWidth
              label="Título de la restricción"
              onChange={(e) => changeValue("title", e.target.value)}
            />
          </ListItem>
          <ListItem>
            <FormControl component="fieldset">
              <FormLabel sx={{ marginBottom: "5pt" }}>
                <TextField
                  variant="standard"
                  label="Pregunta para el usuario"
                  fullWidth
                  onChange={(e) => changeValue("question", e.target.value)}
                />
              </FormLabel>
              <RadioGroup sx={{ mb: 1 }}>
                {restriction.options.map((option, i) => (
                  <Box
                    sx={{
                      display: "flex",
                    }}
                    key={i}
                  >
                    <FormControlLabel
                      disabled
                      control={<Radio />}
                      value={option}
                      label={
                        <TextField
                          variant="standard"
                          value={option}
                          onChange={handleChangeRestriction(i)}
                          placeholder="Opción"
                        />
                      }
                    />
                    {restriction.optionSelected === i ? (
                      <Tooltip title="Esta es la opción correcta">
                        <IconButton
                          sx={{
                            backgroundColor: "#006225",
                            "&:hover": {
                              backgroundColor: "#006225",
                            },
                          }}
                        >
                          <Check sx={{ color: "#fff" }} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Elegir esta opción">
                        <IconButton
                          onClick={() => changeValue("optionSelected", i)}
                        >
                          <Check />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Eliminar">
                      <IconButton onClick={deleteRestriction(i)}>
                        <Clear />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
                {restriction.other && (
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <FormControlLabel
                      disabled
                      control={<Radio />}
                      value="otros"
                      label="Otros"
                    />

                    <Tooltip title="Eliminar">
                      <IconButton onClick={() => changeValue("other", false)}>
                        <Clear />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </RadioGroup>
              <Button onClick={addRestriction}>Agregar opción</Button>
              {!restriction.other && (
                <Button onClick={() => changeValue("other", true)}>
                  Agregar "Otros"
                </Button>
              )}
            </FormControl>
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreate}>Crear</Button>
      </DialogActions>
    </>
  );
};

const RestrictionDialog = ({ open, setOpen }) => {
  const fullScreen = useMediaQuery("(max-width:320pt)");

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      fullScreen={fullScreen}
      fullWidth
      sx={{ maxWidth: "320pt", margin: "auto" }}
      keepMounted={false}
    >
      <DialogBody closeDialog={closeDialog} />
    </Dialog>
  );
};

export default RestrictionDialog;
