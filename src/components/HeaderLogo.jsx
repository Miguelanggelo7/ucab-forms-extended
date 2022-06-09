import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const HeaderLogo = ({ sx, ...props }) => {
  const user = useUser();

  return (
    <Box
      component={Link}
      to={user ? "/dashboard" : "/login"}
      sx={{
        display: "flex",
        alignItems: "center",
        color: "inherit",
        textDecoration: "none",
        ...sx,
      }}
      {...props}
    >
      <Typography variant="h6" component="h1" align="center">
        UCAB Forms
      </Typography>
    </Box>
  );
};

export default HeaderLogo;
