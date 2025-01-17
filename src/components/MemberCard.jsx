import "./Footer.css";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { IconButton } from "@mui/material";
import { Fade } from "react-reveal";

const MemberCard = (props) => {
  const StyleIcon = {
    color: "#fff",
    fontSize: "26px",
  };

  const StyleButton = {
    margin: "3pt",
  };

  return (
    <Fade>
      <div className="member">
        <div style={{ width: "230px", margin: "auto" }}>
          <div className="contImg">
            <img src={props.img} className="imageMember" />
          </div>
        </div>
        <p className="name">{props.name}</p>
        <p className="role">{props.role}</p>
        <div class="contact">
          <div style={{ height: "150px" }} />
          <IconButton
            sx={StyleButton}
            onClick={() => window.open(`https://wa.me/${props.number}`)}
          >
            <WhatsAppIcon sx={StyleIcon} />
          </IconButton>
          <IconButton sx={StyleButton} onClick={() => window.open(props.git)}>
            <GitHubIcon sx={StyleIcon} />
          </IconButton>
          <IconButton
            sx={StyleButton}
            onClick={() => window.open(props.instagram)}
          >
            <InstagramIcon sx={StyleIcon} />
          </IconButton>
          <IconButton
            sx={StyleButton}
            onClick={() => window.open(props.linkedin)}
          >
            <LinkedInIcon sx={StyleIcon} />
          </IconButton>
        </div>
      </div>
    </Fade>
  );
};

export default MemberCard;
