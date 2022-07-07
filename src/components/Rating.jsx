import { useState } from "react";
import { Box, Rating as MuiRating, Typography } from "@mui/material";
import { ratingLabels } from "../constants/questions";
import { styled } from "@mui/material/styles";
import {
  Favorite,
  FavoriteBorder,
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentSatisfied,
  SentimentSatisfiedAlt,
  SentimentVerySatisfied,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const StyledRating = styled(MuiRating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

const EmojiRating = styled(MuiRating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfied color="error" />,
  },
  2: {
    icon: <SentimentDissatisfied color="error" />,
  },
  3: {
    icon: <SentimentSatisfied color="warning" />,
  },
  4: {
    icon: <SentimentSatisfiedAlt color="secondary" />,
  },
  5: {
    icon: <SentimentVerySatisfied color="secondary" />,
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

const Rating = ({
  value,
  onChange,
  readOnly,
  ratingProps,
  typographyProps,
  boxProps,
  boxSx,
  question,
}) => {
  const [hover, setHover] = useState(-1);

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", gap: 2, ...boxSx }}
      {...boxProps}
    >
      {console.log(question)}
      {question.typeRating === "star" ? (
        <MuiRating
          value={value}
          onChange={(event, newValue) => {
            setHover(-1);
            onChange(event, newValue);
          }}
          readOnly={readOnly}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          {...ratingProps}
        />
      ) : question.typeRating === "heart" ? (
        <StyledRating
          value={value}
          onChange={(event, newValue) => {
            setHover(-1);
            onChange(event, newValue);
          }}
          readOnly={readOnly}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          icon={<Favorite fontSize="inherit" />}
          emptyIcon={<FavoriteBorder fontSize="inherit" />}
          {...ratingProps}
        />
      ) : question.typeRating === "face" ? (
        <EmojiRating
          value={value}
          onChange={(event, newValue) => {
            setHover(-1);
            onChange(event, newValue);
          }}
          readOnly={readOnly}
          onChangeActive={(event, newHover) => {
            setHover(newHover);
          }}
          IconContainerComponent={IconContainer}
          highlightSelectedOnly
          {...ratingProps}
        />
      ) : null}
      <Typography {...typographyProps}>
        {ratingLabels[hover !== -1 ? hover : value]}
      </Typography>
    </Box>
  );
};

export default Rating;
