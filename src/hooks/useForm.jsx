import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getForm } from "../api/forms";
import { getTree } from "../api/trees";
import { getQuestionsChanges } from "../api/questions";
import { getResponses } from "../api/responses";

const FormContext = createContext();

const useForm = () => {
  return useContext(FormContext);
};

const FormProvider = ({ children }) => {
  const { id: formId } = useParams();
  const [form, setForm] = useState(null);
  const [tree, setTree] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeForm = getForm(formId, (form) => {
      setForm(form);
      setLoading(false);
    });

    const unsubscribeQuestions = getQuestionsChanges(formId, (changes) => {
      setQuestions((oldQuestions) => {
        const questions = [...oldQuestions];
        console.log(questions);
        changes.forEach((change) => {
          if (change.type === "added") {
            questions.splice(change.newIndex, 0, change.question);
          } else if (change.type === "modified") {
            questions.splice(change.oldIndex, 1);
            questions.splice(change.newIndex, 0, change.question);
          } else if (change.type === "removed") {
            questions.splice(change.oldIndex, 1);
          }
        });

        return questions;
      });
    });

    const unsubscribeResponses = getResponses(formId, (responses) => {
      setResponses(responses);
    });

    return () => {
      unsubscribeForm();
      unsubscribeQuestions();
      unsubscribeResponses();
    };
  }, [formId]);

  useEffect(() => {
    const unsuscribeTree = getTree(form, (tree) => {
      setTree(tree);
    });

    return () => {
      unsuscribeTree();
    };
  }, [form]);

  const value = {
    form,
    setForm,
    tree,
    setTree,
    questions,
    setQuestions,
    responses,
    loading,
    current,
    setCurrent,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export { useForm, FormProvider };
