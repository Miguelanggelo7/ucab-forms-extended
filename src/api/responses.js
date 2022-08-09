import {
  collection,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { uploadFiles, uploadRecordedAudio } from "./storage";
import { FILE, VOICE, IMAGE } from "../constants/questions";
import { sendNotification } from "./notifications";

export const submitResponse = async (form, response, user) => {
  try {
    console.log(response);
    response.submittedAt = new Date();

    await Promise.all(
      form.questions.map(async (question) => {
        if (question.type === FILE || question.type === IMAGE) {
          console.log(response.answers[question.id]);
          response.answers[question.id] = await uploadFiles(
            response.answers[question.id]
          );
        } else if (question.type === VOICE) {
          response.answers[question.id] = await uploadRecordedAudio(
            response.answers[question.id],
            response.answers[question.id + "-text"]
          );
        }
      })
    );

    const responsesRef = collection(db, "forms", form.id, "responses");
    const responseRef = doc(responsesRef);

    const newRes = {
      ...response,
    };

    if (user) newRes.user = user;
    setDoc(responseRef, newRes);

    const formRef = doc(db, "forms", form.id);
    updateDoc(formRef, {
      responses: increment(1),
    });

    sendNotification({
      userId: form.author.id,
      message: `Alguien ha respondido tu encuesta "${form.title}"`,
      goto: `/forms/edit/${form.id}`,
    });

    form.collaborators.forEach((collaborator) => {
      sendNotification({
        userId: collaborator.id,
        message: `Alguien ha respondido la encuesta "${form.title}"`,
        goto: `/forms/edit/${form.id}`,
      });
    });

    return { responseId: responseRef.id };
  } catch (error) {
    console.log(error);
    return { error: { message: "Error al guardar las respuestas" } };
  }
};

export const getResponses = (formId, callback) => {
  const responsesRef = collection(db, "forms", formId, "responses");

  const q = query(responsesRef, orderBy("submittedAt"));

  return onSnapshot(q, (snapshot) => {
    const responses = snapshot.docs.map((doc) => {
      const response = doc.data();
      response.id = doc.id;
      response.submittedAt = response.submittedAt.toDate();
      return response;
    });

    callback(responses);
  });
};

export const checkUserHasResponses = async (formId, userId) => {
  try {
    const responsesRef = collection(db, "forms", formId, "responses");
    const q = query(responsesRef, where("user.id", "==", userId));

    const snapshot = await getDocs(q);

    return snapshot.docs.length > 0;
  } catch (error) {
    return true;
  }
};

export const addComment = (formId, responseId, comments) => {
  const responseRef = doc(db, "forms", formId, "responses", responseId);
  updateDoc(responseRef, { comments });
};
