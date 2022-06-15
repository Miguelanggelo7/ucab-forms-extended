import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Toolbar,
  Tooltip,
  Typography,
  Input,
} from "@mui/material";
import {
  AccountCircle,
  Logout as LogoutIcon,
  TextFields,
} from "@mui/icons-material";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { signOut } from "../api/auth";
import HeaderLogo from "./HeaderLogo";
import Notifications from "./Notifications";
import { useNetwork } from "../hooks/useNetwork";
import SignalWifiStatusbar4BarIcon from "@mui/icons-material/SignalWifiStatusbar4Bar";
import SignalWifiOffIcon from "@mui/icons-material/SignalWifiOff";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Header = ({ leftIcons, rightIcons, moreMenu }) => {
  const user = useUser();
  const theme = useTheme();
  // let [isOnline, connection] = useNetwork();

  const popupStateUser = usePopupState({
    variant: "popover",
    popupId: "user-menu",
  });

  const [font, setFont] = useState("Poppins");
  const [size, setSize] = useState("medium");

  const changeFont = (event) => {
    setFont(event.target.value);
  };

  const changeSize = (event) => {
    setSize(event.target.value);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {leftIcons}
            {/* Las siguientes lineas de codigo permiten mostrar el estado de conexion del usuario */}
            {/* <Tooltip
              title={
                isOnline
                  ? "Está conectado a internet"
                  : "No está conectado a internet"
              }
              sx={{ marginRight: "10pt" }}
            >
              {isOnline ? (
                <SignalWifiStatusbar4BarIcon color="secondary" />
              ) : (
                <SignalWifiOffIcon color="error" />
              )}
            </Tooltip> */}
            <HeaderLogo
              sx={{
                position: { sm: "absolute" },
                top: { sm: "50%" },
                left: { sm: "50%" },
                transform: { sm: "translate(-50%, -50%)" },
              }}
            />
          </Box>
          <Box>
            {rightIcons}
            {user ? (
              <>
                <Notifications />
                <Tooltip title="Usuario" arrow>
                  <IconButton
                    size="large"
                    color="inherit"
                    edge="end"
                    {...bindTrigger(popupStateUser)}
                  >
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
                <Menu {...bindMenu(popupStateUser)}>
                  <MenuItem onClick={popupStateUser.close}>
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    {user.name}
                  </MenuItem>
                  <Divider textAlign="left">Fuente</Divider>
                  <MenuItem>
                    <FormControl fullWidth size="small">
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={font}
                        onChange={changeFont}
                      >
                        <MenuItem value={"Poppins"}>
                          <Typography style={{ fontFamily: "Poppins" }}>
                            Poppins
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"Arial"}>
                          <Typography style={{ fontFamily: "Arial" }}>
                            Arial
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"Calibri"}>
                          <Typography style={{ fontFamily: "Calibri" }}>
                            Calibri
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"Helvetica"}>
                          <Typography style={{ fontFamily: "Helvetica" }}>
                            Helvetica
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"Georgia"}>
                          <Typography style={{ fontFamily: "Georgia" }}>
                            Georgia
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"Monospace"}>
                          <Typography style={{ fontFamily: "Monospace" }}>
                            Monospace
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"Tahoma"}>
                          <Typography style={{ fontFamily: "Tahoma" }}>
                            Tahoma
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"Times New Roman"}>
                          <Typography style={{ fontFamily: "Times New Roman" }}>
                            Times New Roman
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"Verdana"}>
                          <Typography style={{ fontFamily: "Verdana" }}>
                            Verdana
                          </Typography>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </MenuItem>
                  <MenuItem>
                    <FormControl fullWidth size="small">
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={size}
                        onChange={changeSize}
                      >
                        <MenuItem value={"small"}>
                          <Typography style={{ fontSize: "Small" }}>
                            Pequeña
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"medium"}>
                          <Typography style={{ fontSize: "Medium" }}>
                            Mediana
                          </Typography>
                        </MenuItem>
                        <MenuItem value={"large"}>
                          <Typography style={{ fontSize: "Large" }}>
                            Grande
                          </Typography>
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={signOut}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Cerrar sesión
                  </MenuItem>
                </Menu>
                {moreMenu}
              </>
            ) : (
              <>
                <Button
                  size="small"
                  variant="contained"
                  component={Link}
                  to="/login"
                >
                  Ingresar
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Header;
