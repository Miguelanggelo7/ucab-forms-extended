import { format } from "date-fns";
import {
  CHECKBOX,
  DATE,
  DATETIME,
  FILE,
  SORTABLE,
  TIME,
  IMAGE,
} from "../constants/questions";

export const getResponseCountText = (count) => {
  if (count === 1) {
    return "1 respuesta";
  }

  return `${count} respuestas`;
};

export const stringifyAnswers = (answers, questions) => {
  const newAnswers = {};

  for (const questionId in answers) {
    const answer = answers[questionId];

    if (answer !== 0 && (!answer || answer.length === 0)) {
      newAnswers[questionId] = null;
      continue;
    }

    const question = questions.find((q) => q.id === questionId);

    if (!question) {
      continue;
    }

    switch (question.type) {
      case DATE:
        newAnswers[questionId] = format(answer.toDate(), "dd/MM/yyyy");
        break;
      case DATETIME:
        newAnswers[questionId] = format(answer.toDate(), "dd/MM/yyyy HH:mm");
        break;
      case TIME:
        newAnswers[questionId] = format(answer.toDate(), "HH:mm");
        break;
      case FILE:
      case IMAGE:
        newAnswers[questionId] = answer.map((f) => f.url).join(", ");
        break;
      case CHECKBOX:
      case SORTABLE:
        newAnswers[questionId] = answer.join(", ");
        break;
      default:
        newAnswers[questionId] = answer;
    }
  }

  return newAnswers;
};
