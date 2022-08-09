import { Container, Typography } from "@mui/material";
import { useEffect } from "react";
import DashboardTable from "../components/DashboardTable";
import Footer from "../components/Footer";
import { useFont } from "../hooks/useFont";
import Lottie from "lottie-react";
import welcome from "../img/homeWelcome.json";
import { useUser } from "../hooks/useUser";

const Dashboard = () => {
  const user = useUser();

  return (
    <>
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <>
          <Typography variant="h4">¡Hola {user.name}!</Typography>
          <Lottie
            animationData={welcome}
            loop={true}
            style={{
              width: "100%",
              maxWidth: "300pt",
              margin: "auto",
              marginTop: "-50pt",
            }}
          />
          <Typography
            variant="body2"
            sx={{ marginBottom: "30pt", marginTop: "-30pt" }}
          >
            UCAB Forms es una herramienta hecha por ucabistas para crear, llenar
            y administrar encuestas.
            <br />
            En la tabla de <strong>Mis encuestas</strong> presiona el botón "
            <strong>+</strong>" para crear una encuesta.
          </Typography>
        </>
        <DashboardTable />
      </Container>
      <Footer />
    </>
  );
};

export default Dashboard;
