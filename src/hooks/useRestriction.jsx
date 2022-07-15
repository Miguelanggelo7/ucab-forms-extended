import { createContext, useContext, useEffect, useState } from "react";
import { getRestrictions } from "../api/restrictions";

const RestrictionsContext = createContext();

const useRestrictions = () => {
  return useContext(RestrictionsContext);
};

const RestrictionsProvider = ({ children }) => {
  const [restrictionsList, setRestrictionsList] = useState([]);

  useEffect(() => {
    const unsuscribeRestriction = getRestrictions((restrictions) => {
      setRestrictionsList(restrictions);
    });

    return () => {
      unsuscribeRestriction();
    };
  }, []);

  const value = {
    restrictionsList,
  };

  return (
    <RestrictionsContext.Provider value={value}>
      {children}
    </RestrictionsContext.Provider>
  );
};

export { useRestrictions, RestrictionsProvider };
