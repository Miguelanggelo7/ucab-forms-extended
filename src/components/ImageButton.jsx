import { Button } from "@mui/material";
import { Image } from "@mui/icons-material";
import { useSnackbar } from "notistack";

const ImageButton = ({ inputId, onChange, multiple, disabled }) => {
  const id = "upload-button" + inputId;
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    if (e.target.files[0].type.includes("image")) {
      if (e.target.files.length) {
        onChange(e.target.files);
      }
    } else {
      return enqueueSnackbar("Solo está permitido cargar imágenes", {
        variant: "error",
      });
    }
  };

  return (
    <label htmlFor={id}>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id={id}
        multiple={multiple}
        type="file"
        disabled={disabled}
        onChange={(e) => handleChange(e)}
      />
      <Button
        disabled={disabled}
        variant="contained"
        startIcon={<Image />}
        component="span"
      >
        Cargar imagen{multiple ? "es" : ""}
      </Button>
    </label>
  );
};

export default ImageButton;
