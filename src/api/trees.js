import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { indexOf } from "lodash";
import { db } from "./firebaseConfig";
import { saveForm, createForm, getFormOnce } from "./forms";

const treesRef = collection(db, "trees");

export const enableSections = (form) => {
  const ref = doc(treesRef);

  setDoc(ref, {
    title: "Nueva Sección",
    children: [form.id],
    subTrees: [],
    id: Math.floor(Math.random() * 10000) + 1,
  });

  saveForm({ ...form, treeId: ref.id });
};

export const addChild = async ({ child, user, treeId, parentId }) => {
  const childId = child ? child : createForm(user, treeId);
  try {
    const treeRef = doc(db, "trees", treeId);
    const tree = await getTreeOnce(treeRef);

    tree.id === parentId
      ? tree.children.push(childId)
      : editTreeById(tree.subTrees, { id: parentId, childId }, "add-form");

    if (child) {
      const formRef = doc(db, "forms", childId);
      updateDoc(formRef, {
        treeId,
      });
    }

    saveTree(tree);

    return childId;
  } catch (err) {
    return {
      error: {
        message: "Error creando encuesta",
      },
    };
  }
};

export const addTree = async (treeId, parentId, title) => {
  try {
    const treeRef = doc(db, "trees", treeId);
    const tree = await getTreeOnce(treeRef);

    const data = {
      title: title === "" ? "Nueva sección" : title,
      children: [],
      subTrees: [],
      id: Math.floor(Math.random() * 10000) + 1,
    };

    tree.id === parentId
      ? tree.subTrees.push(data)
      : editTreeById(
          tree.subTrees,
          { id: parentId, newTree: data },
          "add-tree"
        );

    saveTree(tree);

    return tree;
  } catch (err) {
    return {
      error: {
        message: "Error creando sección",
      },
    };
  }
};

export const deleteIdFromTree = async (formId, treeId) => {
  const treeRef = doc(db, "trees", treeId);
  const tree = await getTreeOnce(treeRef);

  const i = tree.children.indexOf(formId);

  i === -1
    ? deleteFormInTree(tree.subTrees, formId)
    : tree.children.splice(i, i + 1);
  console.log(tree);
  saveTree(tree);
};

const deleteFormInTree = (trees, formId) => {
  trees.forEach((tree) => {
    const i = tree.children.indexOf(formId);

    if (i !== -1) {
      tree.children.splice(i, i + 1);
      return;
    }

    deleteFormInTree(tree.subTrees, formId);
  });
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
      i !== -1 ? (tree.children[i] = form) : findChildData(tree.subTrees, form);
    });

    callback(tree);
  });
};

const findChildData = (sections, doc) => {
  sections.forEach((tree) => {
    const i = tree.children.indexOf(doc.id);

    if (i !== -1) {
      tree.children[i] = doc;
      return;
    }

    findChildData(tree.subTrees, doc);
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
    tree.id === deleteId
      ? await deleteAllTree(treeRef)
      : await deleteSubTree(tree, deleteId);

    return {
      success: { message: "Sección eliminada correctamente" },
    };
  } catch (err) {
    console.log(err);
    return {
      error: { message: "Error al eliminar la sección" },
    };
  }
};

const deleteSubTree = async (root, deleteId) => {
  const { subTrees, ...rest } = root;
  const newSubTrees = findAndDeleteSubTrees(subTrees, deleteId);

  const tree = {
    ...rest,
    subTrees: newSubTrees,
  };

  saveTree(tree);
  return tree;
};

const findAndDeleteSubTrees = (trees, deleteId, founded) => {
  return trees.filter((tree) => {
    if ((typeof founded === "undefined" || !founded) && tree.id !== deleteId) {
      tree.subTrees = findAndDeleteSubTrees(tree.subTrees, deleteId, false);
      return true;
    }

    tree.children = tree.children.map(async (docId) => {
      const doc = await getFormOnce(docId);
      const { treeId, questions, ...docData } = doc;
      saveForm(docData);
      return docData;
    });

    tree.subTrees = findAndDeleteSubTrees(tree.subTrees, deleteId, true);
    return false;
  });
};

const deleteAllTree = async (treeRef) => {
  const formsRef = collection(db, "forms");
  const q = query(formsRef, where("treeId", "==", treeRef.id));
  const docs = (await getDocs(q)).docs;

  await runTransaction(db, async (transaction) => {
    transaction.delete(treeRef);

    docs.forEach((form) => {
      const formRef = doc(db, "forms", form.id);
      transaction.update(formRef, {
        treeId: deleteField(),
      });
    });
  });

  return null;
};

const editTreeById = (trees, data, action) => {
  const { id, title, childId, newTree } = data;
  trees.forEach((tree) => {
    if (tree.id === id) {
      switch (action) {
        case "edit":
          tree.title = title;
          break;

        case "add-form":
          tree.children.push(childId);
          break;

        case "add-tree":
          tree.subTrees.push(newTree);
          break;

        default:
          break;
      }
      return;
    }

    editTreeById(tree.subTrees, data, action);
  });
};

export const saveTree = (tree) => {
  const { treeId: id, ...treeData } = tree;
  const treeRef = doc(db, "trees", id);
  updateDoc(treeRef, treeData);
};
