import {
  collection,
  deleteDoc,
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

const treesRef = collection(db, "trees");

export const enableSections = (form) => {
  const ref = doc(treesRef);

  setDoc(ref, {
    title: "Nueva Sección",
    children: [form.id],
    subTrees: [],
    id: Math.floor(Math.random() * 1000) + 1,
  });

  saveForm({ ...form, treeId: ref.id });
};

export const addChild = (user, tree, treeId) => {
  const childId = createForm(user);

  tree.id === treeId
    ? tree.children.push(childId)
    : findTreeId(tree.subTrees, treeId, childId);

  saveTree(tree);

  return tree;
};

export const getAndSetTree = (id, forms, callback) => {
  const ref = id ? doc(treesRef, id) : doc(treesRef);
  return onSnapshot(ref, (doc) => {
    if (!doc.exists()) {
      return callback(null);
    }

    const tree = { treeId: doc.id, ...doc.data() };

    forms.forEach((form) => {
      const i = tree.children.indexOf(form.id);
      i !== -1 ? (tree.children[i] = form) : findChildId(tree.subTrees, form);
    });

    callback(tree);
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

const getTreeOnce = async (treeRef) => {
  const tree = await getDoc(treeRef);

  if (!tree.exists()) return null;

  const data = { ...tree.data(), treeId: tree.id };

  return data;
};

export const updateTitle = async (id, newData) => {
  try {
    const treeRef = doc(db, "trees", id);
    const tree = await getTreeOnce(treeRef);

    tree.id === newData.id
      ? (tree.title = newData.title)
      : editTreeById(tree.subTrees, newData, "edit");

    saveTree(tree);
    return tree;
  } catch (err) {
    return {
      error: { message: "Error al actualizar el nombre de la sección" },
    };
  }
};

export const deleteTree = async (id, deleteId) => {
  try {
    const treeRef = doc(db, "trees", id);
    const tree = await getTreeOnce(treeRef);
    console.log(treeRef.id);
    // const data = tree.id === deleteId ?
  } catch (err) {
    return {
      error: { message: "Error al eliminar la sección" },
    };
  }
};

// const deleteSubTree =

const deleteAllTree = async (treeRef) => {
  await deleteDoc(treeRef);
  return null;
};

const editTreeById = (trees, data, action) => {
  trees.forEach((tree) => {
    if (tree.id === data.id) {
      switch (action) {
        case "edit":
          tree.title = data.title;
          break;

        case "addForm":
          tree.children.push(data);
          break;

        default:
          break;
      }
      return;
    }

    editTreeById(tree.subTrees, data);
  });
};

export const saveTree = (tree) => {
  const { treeId: id, ...treeData } = tree;
  const treeRef = doc(db, "trees", id);
  updateDoc(treeRef, treeData);
};
