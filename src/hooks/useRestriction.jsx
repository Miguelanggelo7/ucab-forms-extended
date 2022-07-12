import { createContext, useContext, useEffect, useState } from "react";
import { getRestrictions, getFormRestrictions } from "../api/restrictions";
import { useForm } from "../hooks/useForm";

const RestrictionsContext = createContext();

const useRestrictions = () => {
  return useContext(RestrictionsContext);
};

const RestrictionsProvider = ({ children }) => {
  const { questions } = useForm();
  const [formRestrictions, setFormRestrictions] = useState([]);
  const [restrictionsList, setRestrictionsList] = useState([]);

  useEffect(() => {
    const unsuscribeFormRestrictions = getFormRestrictions(
      questions,
      (restrictions) => {
        console.log(restrictions);
        setFormRestrictions(restrictions);
      }
    );

    return () => {
      if (unsuscribeFormRestrictions) unsuscribeFormRestrictions();
    };
  }, [questions]);

  useEffect(() => {
    const unsuscribeRestriction = getRestrictions((restrictions) => {
      setRestrictionsList(restrictions);
    });

    return () => {
      unsuscribeRestriction();
    };
  }, []);

  const value = {
    formRestrictions,
    restrictionsList,
  };

  return (
    <RestrictionsContext.Provider value={value}>
      {children}
    </RestrictionsContext.Provider>
  );
};

export { useRestrictions, RestrictionsProvider };
