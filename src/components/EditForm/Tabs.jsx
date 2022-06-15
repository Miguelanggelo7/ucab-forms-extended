import { useState } from "react";
import { AppBar, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Questions from "./Questions";
import Responses from "./Responses";
import Fade from "react-reveal/Fade";

const Tabs = ({ setOpenDrawer }) => {
  const [currentTab, setCurrentTab] = useState("0");

  const handleChangeTab = (e, value) => {
    setCurrentTab(value);
  };

  return (
    <TabContext value={currentTab}>
      <AppBar position="static">
        <TabList
          onChange={handleChangeTab}
          textColor="inherit"
          indicatorColor="primary"
          variant="fullWidth"
          aria-label="questions/responses tabs"
        >
          <Tab label="Preguntas" value={"0"} />
          <Tab label="Respuestas" value={"1"} />
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
    </TabContext>
  );
};

export default Tabs;
