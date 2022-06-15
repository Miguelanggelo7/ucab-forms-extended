import Saad from "../img/josesaad.jpg";
import "./Footer.css";
import MemberCard from "./MemberCard";

const Footer = () => {
  return (
    <footer style={{ width: "100%" }}>
      <div className="container" id="miequipo">
        <p className="title">Desarrolladores</p>
        <div className="membersContainer">
          <MemberCard
            img={Saad}
            number={"+584141992998"}
            git={"https://github.com/Saadsito"}
            instagram={"https://www.instagram.com/josemsaad/"}
            linkedin={"https://www.linkedin.com/in/jose-saad-556223206/"}
          />
          <MemberCard img={Saad} />
          <MemberCard img={Saad} />
          <MemberCard img={Saad} />
          <MemberCard img={Saad} />
          <MemberCard img={Saad} />
          <MemberCard img={Saad} />
          <MemberCard img={Saad} />
          <MemberCard img={Saad} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
