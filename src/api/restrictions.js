import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  setDoc,
  where,
  getDoc,
  getDocs,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const resRef = collection(db, "restrictions");

export const getRestrictions = (callback) => {
  const q = query(resRef, orderBy("title", "asc"));

  return onSnapshot(q, (snapshot) => {
    const restrictions = snapshot.docs.map((doc) => {
      const restriction = doc.data();

      return { label: restriction.title, id: doc.id };
    });

    callback(restrictions);
  });
};

const isDuplicated = (array, value, index) => {
  array.forEach((item, i) => {
    if (item && item.value === value) return i === index ? false : true;
  });
};

export const getFormRestrictions = (questions, callback) => {
  const data = questions
    .map((question) => {
      return question.restricted
        ? question.restrictions.map((value) => {
            return {
              questionId: question.id,
              value,
            };
          })
        : null;
    })
    .flat();

  // nullless, without emptiness and unduplicated array
  const cleanData = data.filter(
    (item, index) =>
      item &&
      item.value !== "" &&
      item.value !== null &&
      !isDuplicated(data, item.value, index)
  );

  const keys = cleanData.map((item) => item.value);

  if (keys.length === 0) {
    callback([]);
    return null;
  }

  const q = query(resRef, where("title", "in", keys));
  return onSnapshot(q, (snapshot) => {
    const restrictions = snapshot.docs.map((doc) => {
      const { question, options, optionSelected } = doc.data();

      return {
        question,
        options,
        optionSelected,
        id: doc.id,
      };
    });

    callback(restrictions);
  });
};

export const createRestriction = async (restriction, user) => {
  const title =
    restriction.title[0].toUpperCase() +
    restriction.title.trimEnd().trimStart().toLowerCase().substring(1);

  const q = query(resRef, where("title", "==", title));

  const verify = await getDocs(q);
  console.log(verify.size);
  if (verify.size !== 0) throw new Error("restriction title already exists");

  const dataRef = doc(resRef);

  setDoc(dataRef, {
    author: {
      ...user,
    },

    ...restriction,
    title,
  });
};

export const answerRestriction = async (userId, formId, response) => {
  /*

  response = {
    userId,
    title: 'Solo hombres',
    value: null
  }

  */
  const responsesRef = collection(db, "forms", formId, "conditions");
  const responseRef = doc(responsesRef);

  (await getDoc(responseRef)).exists
    ? updateDoc(responseRef, arrayUnion(response))
    : setDoc(responseRef, response);
};
