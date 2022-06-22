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
  FormControl,
  RadioGroup,
  Box,
  FormControlLabel,
  Radio,
  FormLabel,
} from "@mui/material";
import { Check, Clear, Close as CloseIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const DialogBody = ({ closeDialog }) => {
  const dataRestriction = {
    title: "",
    question: "",
    options: [""],
    optionSelected: 0,
    other: false,
  };

  const [restriction, setRestriction] = useState(dataRestriction);

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

      setRestriction(newRestriction);
    }
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
                      <Tooltip title="Elegir esta opción">
                        <IconButton>
                          <Check />
                        </IconButton>
                      </Tooltip>
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
          <Button
            onClick={() => {
              console.log(restriction);
            }}
          >
            Crear
          </Button>
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
      sx={{ maxWidth: "320pt", margin: "auto" }}
      keepMounted={false}
    >
      <DialogBody closeDialog={closeDialog} />
    </Dialog>
  );
};

export default RestrictionDialog;
