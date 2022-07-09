import { useMemo, useRef, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useForm } from "../../hooks/useForm";
import { APP_URL } from "../../constants/urls";
import QRCode from "react-qr-code";
import { useCapture } from "react-capture";

const SendDialog = ({ open, setOpen }) => {
  const { form } = useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { snap } = useCapture();
  const element = useRef(null);

  const downloadQR = useCallback(() => {
    snap(element, { file: `${form.title}-QR.png` });
  }, [snap, element]);

  return useMemo(() => {
    const handleClose = () => {
      setOpen(false);
    };

    const formUrl = `${APP_URL}/forms/answer/${form.id}`;

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(formUrl);
        enqueueSnackbar("URL copiada al portapapeles", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("No se pudo copiar la URL", { variant: "error" });
      }
    };

    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Enviar Encuesta</DialogTitle>
        <DialogContent>
          <div
            style={{
              margin: "auto",
              maxWidth: "192pt",
              width: "100%",
              maxHeight: "192pt",
            }}
            ref={element}
          >
            <QRCode value={formUrl} />
          </div>
        </DialogContent>
        <DialogContent sx={{ marginTop: "-25pt" }}>
          <TextField
            variant="standard"
            fullWidth
            defaultValue={formUrl}
            onFocus={(e) => e.target.select()}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ marginTop: "-15pt" }}>
          <Button onClick={downloadQR}>Descargar QR</Button>
          <div style={{ flex: "1 0 0" }} />
          <Button onClick={handleClose}>Cerrar</Button>
          <Button onClick={handleCopy}>Copiar URL</Button>
        </DialogActions>
      </Dialog>
    );
  }, [enqueueSnackbar, form.id, open, setOpen]);
};

export default SendDialog;
