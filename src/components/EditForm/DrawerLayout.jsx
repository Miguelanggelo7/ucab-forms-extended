import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Container,
  Drawer,
  IconButton,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditQuestion from "./EditQuestion";

const drawerWidth = 350;

const DrawerLayout = ({ open, setOpen, children }) => {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
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
          {upMd ? null : (
            <IconButton onClick={() => setOpen(false)}>
              <ArrowBack />
            </IconButton>
          )}
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
