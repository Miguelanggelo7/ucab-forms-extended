import Saad from "../img/josesaad.jpg";
import Luis from "../img/luissumoza.jpg";
import Nahum from "../img/nahumgiral.jpg";
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
            name={"José Saad"}
            role={"Programador"}
          />
          <MemberCard
            img={Luis}
            number={"+584122155879"}
            git={"https://github.com/Luiscarlossomoza"}
            instagram={"https://www.instagram.com/luchosl1/"}
            linkedin={"https://www.linkedin.com/in/luis-carlos-43a3a6177/"}
            name={"Luis Sumoza"}
            role={"Monitor"}
          />
          <MemberCard
            img={Nahum}
            number={"+584248431411"}
            git={"https://github.com/NahumGiral"}
            instagram={
              "https://www.instagram.com/nahum_agj/?igshid=YmMyMTA2M2Y%3D"
            }
            linkedin={"https://www.linkedin.com/in/nahumgj"}
            name={"Nahum Giral"}
            role={"Tester"}
          />
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
