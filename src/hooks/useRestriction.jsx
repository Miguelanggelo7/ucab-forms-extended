import { createContext, useContext, useEffect, useState } from "react";
import { getRestrictions } from "../api/restrictions";

const RestrictionsContext = createContext();

const useRestrictions = () => {
  return useContext(RestrictionsContext);
};

const RestrictionsProvider = ({ children }) => {
  const [restrictions, setRestrictions] = useState([]);

  useEffect(() => {
    const unsuscribeRestriction = getRestrictions((restrictions) => {
      setRestrictions(restrictions);
    });

    return () => {
      unsuscribeRestriction();
    };
  }, [restrictions]);

  const value = {
    restrictions,
    setRestrictions,
  };

  return (
    <RestrictionsContext.Provider value={value}>
      {children}
    </RestrictionsContext.Provider>
  );
};

export { useRestrictions, RestrictionsProvider };
