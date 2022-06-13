import { Container } from "@mui/material";
import { useEffect } from "react";
import DashboardTable from "../components/DashboardTable";
import { useFont } from "../hooks/useFont";

const Dashboard = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <DashboardTable />
    </Container>
  );
};

export default Dashboard;
