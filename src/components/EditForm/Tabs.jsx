import { useState } from "react";
import { AppBar, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Questions from "./Questions";
import Responses from "./Responses";
import Fade from "react-reveal/Fade";
import Sections from "./Sections";

const Tabs = ({ setOpenDrawer }) => {
  const [currentTab, setCurrentTab] = useState("0");

  const handleChangeTab = (e, value) => {
    setCurrentTab(value);
  };

  return (
    <TabContext value={currentTab}>
      <AppBar position="static" sx={{ zIndex: "1" }}>
        <TabList
          onChange={handleChangeTab}
          textColor="inherit"
          indicatorColor="primary"
          variant="fullWidth"
          aria-label="questions/responses tabs"
        >
          <Tab label="Preguntas" sx={{ fontFamily: "Poppins" }} value={"0"} />
          <Tab label="Respuestas" sx={{ fontFamily: "Poppins" }} value={"1"} />
          <Tab label="Secciones" sx={{ fontFamily: "Poppins" }} value={"2"} />
        </TabList>
      </AppBar>
      <TabPanel sx={{ p: 0, pt: 1 }} value={"0"}>
        <Questions setOpenDrawer={setOpenDrawer} />
      </TabPanel>
      <TabPanel sx={{ p: 0, pt: 1 }} value={"1"}>
        <Fade>
          <Responses />
        </Fade>
      </TabPanel>
      <TabPanel sx={{ p: 0, pt: 1 }} value={"2"}>
        <Fade>
          <Sections />
        </Fade>
      </TabPanel>
    </TabContext>
  );
};

export default Tabs;
