import {
  Box,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { updatePhoneNumber } from "firebase/auth";
import EditQuestion from "./EditQuestion";

const drawerWidth = 350;

const DrawerLayout = ({ open, setOpen, children }) => {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));
  const upXs = useMediaQuery(theme.breakpoints.up("xs"));

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: upXs ? drawerWidth : "100%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: upXs ? drawerWidth : "100%",
            boxSizing: "border-box",
          },
        }}
        variant={upMd ? "permanent" : "temporary"}
        open={upMd ? true : open}
        onClose={() => setOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", p: 2 }}>
          <EditQuestion setOpenDrawer={setOpen} />
        </Box>
      </Drawer>
      <Container sx={{ p: 3 }} maxWidth="md">
        {children}
      </Container>
    </Box>
  );
};

export default DrawerLayout;
