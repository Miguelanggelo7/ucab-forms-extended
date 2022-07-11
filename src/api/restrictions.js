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
  console.log("restrictions");

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
  console.log(questions);
  return onSnapshot();
};

export const createRestriction = async (restriction, user) => {
  const q = query(resRef, where("title", "==", restriction.title));

  // pendiente
  const verify = await getDocs(q);
  console.log(verify.size);
  if (verify.size !== 0) throw new Error("restriction title already exists");

  const dataRef = doc(resRef);
  setDoc(dataRef, {
    author: {
      ...user,
    },
    ...restriction,
  });
};
