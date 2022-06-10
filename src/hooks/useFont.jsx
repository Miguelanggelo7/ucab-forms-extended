import React from "react";
import { useContext, createContext, useState } from "react";

const FontContext = createContext({});

const useFont = () => {
  const context = useContext(FontContext);
  if (context === undefined)
    throw new Error("useFont must be used within FontProvider");
  return context;
};

const FontProvider = ({ children }) => {
  const [font, setFont] = useState({ type: "Poppins", size: "Medium" });

  const value = { font, setFont };

  return <FontContext.Provider value={value}>{children}</FontContext.Provider>;
};

export { useFont, FontProvider };
