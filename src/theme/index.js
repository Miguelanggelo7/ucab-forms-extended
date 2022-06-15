import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#fafafa",
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#4B7ABC",
    },
    secondary: {
      main: "#006225",
    },
    warning: {
      main: "#FFF120",
    },
    error: {
      main: "#C22027",
    },
  },
});

export default theme;
