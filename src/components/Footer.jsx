import Saad from "../img/josesaad.jpg";
import Luis from "../img/luissumoza.jpg";
import Nahum from "../img/nahumgiral.jpg";
import Miguelanggelo from "../img/miguelanggelo.jpg";
import Oliver from "../img/olivertorres.jpeg";
import Diego from "../img/diegogamboa.jpeg";
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
            img={Miguelanggelo}
            number={"+584249125727"}
            git={"https://github.com/Miguelanggelo7"}
            instagram={"https://www.instagram.com/miguel_jhs/"}
            linkedin={
              "https://www.linkedin.com/in/miguelanggelo-sumoza-hurtado-2935861b8/"
            }
            name={"Miguelanggelo Sumoza"}
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
          <MemberCard
            img={Oliver}
            number={"+584148848537"}
            git={"https://github.com/otorres828"}
            instagram={"https://www.instagram.com/otorres828/"}
            linkedin={"https://www.linkedin.com/in/oliver-torres-2760a5175"}
            name={"Oliver Torres"}
            role={"Documentador"}
          />
          <MemberCard
            img={Diego}
            number={"+584167912075"}
            git={"https://github.com/diegogamboa03"}
            instagram={"https://instagram.com/diogamboa?igshid=YmMyMTA2M2Y="}
            linkedin={"www.linkedin.com/in/diego-gamboa-rojas-275199245"}
            name={"Diego Gamboa"}
            role={"Tester"}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
