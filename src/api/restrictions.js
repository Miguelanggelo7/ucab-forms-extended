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

export const getFormRestrictions = (questions, callback) => {
  const data = questions
    .map((question) => {
      return question.restricted ? question.restrictions : null;
    })
    .flat();

  // nullless, without emptiness and unduplicated array
  const keys = data.filter(
    (item, index) =>
      item !== "" && item !== null && data.indexOf(item) === index
  );

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

export const answerRestriction = (restriction, response) => {};
