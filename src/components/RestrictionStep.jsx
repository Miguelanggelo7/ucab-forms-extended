import { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import Lottie from "lottie-react";
import welcomeStep from "../img/welcomestep.json";

export default function RestrictionStep({
  restrictions,
  setArray,
  array,
  setShow,
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [stateRadio, setStateRadio] = useState("");

  const totalSteps = () => {
    return restrictions.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    console.log(array);
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          restrictions.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
    setArray((rest) => rest.filter((_, index) => index !== newActiveStep));
    setStateRadio("");
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    const newCompleted = completed;
    newCompleted[activeStep - 1] = false;
    setCompleted((current) => {
      const copy = { ...current };
      delete copy[activeStep - 1];
      return copy;
    });
    setArray((rest) => rest.filter((_, index) => index !== activeStep));
    setArray((rest) => rest.filter((_, index) => index !== activeStep - 1));
    setStateRadio("");
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleChangeValidatingRest = (e) => {
    setStateRadio(
      restrictions[activeStep].options[
        restrictions[activeStep].options.indexOf(e.target.value)
      ]
    );
    if (
      restrictions[activeStep].options.indexOf(e.target.value) ===
      restrictions[activeStep].optionSelected
    ) {
      if (array.indexOf(restrictions[activeStep].title) === -1)
        setArray([...array, restrictions[activeStep].title]);
    } else {
      setArray((rest) => rest.filter((_, index) => index !== activeStep));
    }
  };

  return (
    <Box
      sx={{
        width: "90%",
        margin: "auto",
        marginTop: "20pt",
        textAlign: "center",
      }}
    >
      <div>
        {allStepsCompleted() ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: "200pt",
                margin: "auto",
              }}
            >
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={() => setShow(true)}>Ir a encuesta</Button>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="h4">¡Espera!</Typography>
            <Lottie
              animationData={welcomeStep}
              loop={false}
              style={{ width: "100%", maxWidth: "300pt", margin: "auto" }}
            />
            <Typography variant="body2" sx={{ marginBottom: "10pt" }}>
              Para llenar esta encuesta, debes responder una serie de preguntas
              antes.
            </Typography>
          </>
        )}
      </div>
      <Stepper
        nonLinear
        activeStep={activeStep}
        alternativeLabel
        sx={{
          overflowX: restrictions.length > 5 ? "scroll" : "hidden",
          overflowY: "hidden",
          paddingBottom: "10pt",
        }}
      >
        {restrictions.map((label, index) => (
          <Step key={label.id} completed={completed[index]} disabled>
            <StepButton color="inherit" onClick={handleStep(index)} />
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? null : (
          <div style={{ margin: "auto", width: "100%", maxWidth: "400pt" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                maxWidth: "200pt",
                margin: "auto",
              }}
            >
              <Typography sx={{ mt: 2, mb: 1, textAlign: "center" }}>
                {restrictions[activeStep].question}
              </Typography>
              <RadioGroup
                value={stateRadio}
                onChange={handleChangeValidatingRest}
              >
                {restrictions[activeStep].options.map((option, i) => (
                  <FormControlLabel
                    key={i}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                pt: 2,
                position: "relative",
              }}
            >
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                <strong>Regresar</strong>
              </Button>
              <Button
                onClick={handleComplete}
                sx={{ mr: 1, position: "absolute", right: "0" }}
                disabled={stateRadio === "" ? true : false}
              >
                <strong>
                  {completedSteps() === totalSteps() - 1
                    ? "Finalizar"
                    : "Siguiente"}
                </strong>
              </Button>
            </Box>
          </div>
        )}
      </div>
    </Box>
  );
}
