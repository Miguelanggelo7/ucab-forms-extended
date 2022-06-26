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
import { saveForm, createForm } from "./forms";

const treeRef = collection(db, "trees");

export const enableSections = (form) => {
  const ref = doc(treeRef);

  setDoc(ref, {
    title: "Nueva Sección",
    children: [form.id],
    subTrees: [],
    id: Math.floor(Math.random() * 1000) + 1,
  });

  saveForm({ ...form, treeId: ref.id });

  return ref;
};

export const addChild = (user, tree, treeId) => {
  const childId = createForm(user);

  tree.id === treeId
    ? tree.children.push(childId)
    : findTreeId(tree.subTrees, treeId, childId);

  saveTree(tree);

  return tree;
};

export const getTree = (form, callback) => {
  const ref =
    !form || typeof form.treeId === "undefined"
      ? doc(treeRef)
      : doc(treeRef, form.treeId);

  return onSnapshot(ref, (doc) => {
    if (!doc.exists()) {
      return callback(null);
    }

    const tree = { treeId: doc.id, ...doc.data() };

    const q = query(collection(db, "forms"), where("treeId", "==", doc.id));

    return onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const data = { ...doc.data(), id: doc.id };
        const i = tree.children.indexOf(data.id);
        i !== -1 ? (tree.children[i] = data) : findChildId(tree.subTrees, data);
      });

      callback(tree);
    });
  });
};

const findTreeId = (sections, treeId, formId) => {
  sections.forEach((tree) => {
    if (treeId === tree.id) {
      tree.children.push(formId);
      return;
    }

    findTreeId(tree.subTrees, treeId, formId);
  });
};

const findChildId = (sections, doc) => {
  sections.forEach((tree) => {
    const i = tree.children.indexOf(doc.id);

    if (i !== -1) {
      tree.children[i] = doc;
      return;
    }

    findChildId(tree.subTrees, doc);
  });
};

export const saveTree = (tree) => {
  const { treeId: id, ...treeData } = tree;
  const treeRef = collection(db, "trees", id);
  updateDoc(treeRef, treeData);
};
