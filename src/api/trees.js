import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { saveForm } from "./forms";

const treeRef = collection(db, "trees");

export const enableSections = (form) => {
  const ref = doc(treeRef);

  setDoc(ref, {
    title: "Nueva Sección",
    children: [form.id],
    subTrees: [],
  });

  saveForm({ ...form, treeId: ref.id });

  return ref;
};

export const getTree = (form, callback) => {
  const ref = form ? doc(treeRef, form.treeId) : doc(treeRef);

  return onSnapshot(ref, (doc) => {
    if (!doc.exists()) {
      return callback(null);
    }

    const tree = doc.data();
    tree.id = doc.id;
    callback(tree);
  });
};
