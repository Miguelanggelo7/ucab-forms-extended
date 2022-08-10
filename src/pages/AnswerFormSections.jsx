import React, { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import useQuery from "../hooks/useQuery";

const AnswerFormSections = () => {
  const query = useQuery();
  const [forms, setForms] = useState(null);
  const formsId = query.get("forms").split(",");

  useEffect(() => {
    const randomizeOptionsOrder = (questions) => {
      questions.forEach((question) => {
        if (question.randomOrder) {
          question.options.sort(() => Math.random() - 0.5);
        }
      });
    };

    const getForms = async () => {};
  }, [formsId]);

  return <div>AnswerFormSections</div>;
};

export default AnswerFormSections;
