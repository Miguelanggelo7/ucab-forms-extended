import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useFont } from "../hooks/useFont";
import { ThemeProvider as OldThemeProvider } from "@mui/material/styles";

const ThemeProvider = ({ children }) => {
  const { font } = useFont();

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: font.family,
        },
        components: {
          MuiInputLabel: {
            styleOverrides: {
              root: {
                fontSize: font.size,
              },
            },
          },
          MuiInput: {
            styleOverrides: {
              root: {
                fontSize: font.size,
              },
            },
          },
          MuiFormControlLabel: {
            styleOverrides: {
              label: {
                fontSize: `${font.size}px`,
              },
            },
          },
          MuiFormLabel: {
            styleOverrides: {
              root: {
                fontSize: `${font.size}px`,
              },
            },
          },
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
      }),
    [font]
  );

  return <OldThemeProvider theme={theme}>{children}</OldThemeProvider>;
};

export default ThemeProvider;
