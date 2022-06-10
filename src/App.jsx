import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { UserProvider } from "./hooks/useUser";
import { FontProvider } from "./hooks/useFont";
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

const App = () => {
  return (
    <UserProvider>
      <AlertProvider>
        <FontProvider>
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
                    <EditForm />
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
        </FontProvider>
      </AlertProvider>
    </UserProvider>
  );
};

export default App;
