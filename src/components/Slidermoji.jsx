import { Box, Slider as MuiSlider, Typography } from "@mui/material";
import { SliderThumb } from "@mui/material/Slider";
import PropTypes from "prop-types";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const Slidermoji = ({ question, ...props }) => {
  const sliderMarks = () => {
    const marks = [];

    for (let i = question.min; i <= question.max; i++) {
      marks.push({ value: i, label: i });
    }

    return marks;
  };

  function AirbnbThumbComponent(props) {
    const { children, ...other } = props;
    return (
      <SliderThumb {...other}>
        {children}
        <img style={{ width: "30px" }} src={question.urlEmoji} />
      </SliderThumb>
    );
  }

  const SliderTheme = createTheme({
    overrides: {
      color: "#4B7ABC",
      height: 3,
      padding: "13px 0",
      "& .MuiSlider-thumb": {
        height: 27,
        width: 27,
        backgroundColor: "#fff",
        border: "none",
        background: "transparent",
        "&:hover": {
          boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
        },
        "& .airbnb-bar": {
          height: 9,
          width: 1,
          backgroundColor: "currentColor",
          marginLeft: 1,
          marginRight: 1,
        },
      },
      "& .MuiSlider-track": {
        height: 3,
      },
      "& .MuiSlider-rail": {
        height: 3,
      },
    },
    palette: {
      primary: {
        main: props.paletteColor,
      },
    },
  });

  AirbnbThumbComponent.propTypes = {
    children: PropTypes.node,
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <ThemeProvider theme={SliderTheme}>
        <MuiSlider
          size="small"
          valueLabelDisplay="auto"
          marks={sliderMarks()}
          sx={{ mx: 2, height: "3pt" }}
          components={{ Thumb: AirbnbThumbComponent }}
          {...props}
        />
      </ThemeProvider>
    </Box>
  );
};

export default Slidermoji;
