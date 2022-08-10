import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { UserProvider } from "./hooks/useUser";
import { AlertProvider } from "./hooks/useAlert";
import { FormProvider } from "./hooks/useForm";
import AuthPage from "./components/AuthPage";
import UnAuthPage from "./components/UnAuthPage";
import AuthLayout from "./components/AuthLayout";
import Header from "./components/Header";
import AnswerPageText from "./components/AnswerPageText";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditForm from "./pages/EditForm";
import AnswerForm from "./pages/AnswerForm";
import Sent from "./pages/Sent";
import Fade from "react-reveal/Fade";
import { RestrictionsProvider } from "./hooks/useRestriction";
// import { useNetwork } from "./hooks/useNetwork";
// import { useEffect, useState } from "react";
// import { useSnackbar } from "notistack";

const App = () => {
  // let [isOnline] = useNetwork();
  // const [boolNot, setBoolNot] = useState(false);
  // const { enqueueSnackbar } = useSnackbar();

  // useEffect(() => {
  //   if (!isOnline) {
  //     setBoolNot(true);
  //     return enqueueSnackbar("Has perdido la conexión a internet", {
  //       variant: "error",
  //     });
  //   } else if (boolNot) {
  //     setBoolNot(false);
  //     return enqueueSnackbar("Estás conectado a internet", {
  //       variant: "success",
  //     });
  //   }
  // }, [isOnline]);

  return (
    <UserProvider>
      <AlertProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            element={
              <UnAuthPage>
                <AuthLayout />
              </UnAuthPage>
            }
          >
            <Route
              path="/login"
              element={
                <>
                  <Fade key={1}>
                    <Login />
                  </Fade>
                </>
              }
            />
            <Route
              path="/signup"
              element={
                <>
                  <Fade key={2}>
                    <Signup />
                  </Fade>
                </>
              }
            />
          </Route>
          <Route
            element={
              <AuthPage>
                <Outlet />
              </AuthPage>
            }
          >
            <Route
              path="/dashboard"
              element={
                <>
                  <Header />
                  <Dashboard />
                </>
              }
            />
            <Route
              path="/forms/edit/:id"
              element={
                <FormProvider>
                  <RestrictionsProvider>
                    <EditForm />
                  </RestrictionsProvider>
                </FormProvider>
              }
            />
          </Route>
          <Route path="/forms/answer/:id" element={<AnswerForm />} />
          <Route path="/forms/answer/:id/sent" element={<Sent />} />
          <Route
            path="*"
            element={
              <AnswerPageText>No se encontró esta página</AnswerPageText>
            }
          />
        </Routes>
      </AlertProvider>
    </UserProvider>
  );
};

export default App;
