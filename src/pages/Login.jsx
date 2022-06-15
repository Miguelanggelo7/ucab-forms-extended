import { Box, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { logIn } from "../api/auth";
import TextField from "../components/TextField";
import PasswordField from "../components/PasswordField";
import Link from "../components/Link";

const initialValues = {
  email: "",
  password: "",
};

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Ingresa tu email, por favor")
    .email("Email inválido"),
  password: yup.string().required("Ingresa tu contraseña, por favor"),
});

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (user, { setSubmitting }) => {
    setSubmitting(true);

    const res = await logIn(user);

    if (!res.ok) {
      setSubmitting(false);
      return enqueueSnackbar(res.error, { variant: "error" });
    }

    enqueueSnackbar("Bienvenido de vuelta", { variant: "success" });
  };

  return (
    <div>
      <Typography variant="h5" component="h2" gutterBottom>
        Iniciar Sesión
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        Accede a tu cuenta para continuar
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              sx={{ mb: 2 }}
              variant="filled"
            />
            <PasswordField
              label="Contraseña"
              name="password"
              required
              sx={{ mb: 2 }}
              variant="filled"
            />
            <Typography sx={{ mb: 2 }}>
              ¿No tienes cuenta?{" "}
              <Link sx={{ fontWeight: 500 }} to="/signup">
                Regístrate
              </Link>
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <LoadingButton
                sx={{ width: 120 }}
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Ingresar
              </LoadingButton>
            </Box>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
