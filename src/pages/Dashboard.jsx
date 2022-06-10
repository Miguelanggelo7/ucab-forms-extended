import { Container } from "@mui/material";
import { useEffect } from "react";
import DashboardTable from "../components/DashboardTable";
import { useFont } from "../hooks/useFont";

const Dashboard = () => {
  const { font, setFont } = useFont();
  useEffect(() => {
    console.log(font);
  }, [font]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <button onClick={() => setFont({ type: "newFont", size: "ola" })}>
        ola
      </button>
      <DashboardTable />
    </Container>
  );
};

export default Dashboard;
