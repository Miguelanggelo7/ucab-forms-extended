import {
  arrayUnion,
  arrayRemove,
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
import { defaultQuestion } from "../constants/questions";
import { getQuestionsOnce, insertQuestion } from "./questions";
import { sendNotification } from "./notifications";
import { deleteIdFromTree } from "./trees";

const formsRef = collection(db, "forms");

export const createForm = (user, treeId) => {
  const formRef = doc(formsRef);
  console.log(user);
  const data = {
    author: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    title: "Encuesta sin título",
    description: "",
    createdAt: new Date(),
    responses: 0,
    collaborators: [],
    settings: {
      allowResponses: true,
      maxResponses: "",
      onlyOneResponse: false,
      startDate: null,
      endDate: null,
      randomOrder: false,
      color: "#4B7ABC",
    },
  };
  data.treeId = typeof treeId === "undefined" ? null : treeId;

  setDoc(formRef, data);

  insertQuestion(formRef.id, { ...defaultQuestion, index: 0 });

  return formRef.id;
};

export const duplicateForm = async (form, user) => {
  try {
    const { id, ...newForm } = form;

    newForm.author = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    newForm.title = `${form.title} - Copia`;
    newForm.createdAt = new Date();
    newForm.responses = 0;
    newForm.collaborators = [];
    newForm.treeId = null;

    const newFormRef = doc(formsRef);
    setDoc(newFormRef, newForm);

    const questions = await getQuestionsOnce(form.id);

    questions.forEach((question) => {
      const { id, ...questionData } = question;
      insertQuestion(newFormRef.id, questionData);
    });

    return { newFormId: newFormRef.id };
  } catch (error) {
    return { error: "Error al duplicar la encuesta" };
  }
};

export const getUserForms = (userId, callback) => {
  const q = query(formsRef, where("author.id", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const forms = snapshot.docs.map((doc) => {
      const form = doc.data();
      form.id = doc.id;
      form.createdAt = form.createdAt.toDate();
      if (form.settings.startDate) {
        form.settings.startDate = form.settings.startDate.toDate();
      }
      if (form.settings.endDate) {
        form.settings.endDate = form.settings.endDate.toDate();
      }
      return form;
    });

    callback(forms);
  });
};

export const getUserUntreeForms = (userId, callback) => {
  const q = query(
    formsRef,
    where("author.id", "==", userId),
    where("treeId", "==", null)
  );

  return onSnapshot(q, (snapshot) => {
    if (snapshot.size === 0) {
      callback([]);
      return null;
    }

    const forms = snapshot.docs.map((doc) => {
      const form = doc.data();
      form.id = doc.id;
      form.createdAt = form.createdAt.toDate();
      if (form.settings.startDate) {
        form.settings.startDate = form.settings.startDate.toDate();
      }
      if (form.settings.endDate) {
        form.settings.endDate = form.settings.endDate.toDate();
      }
      return form;
    });

    callback(forms);
  });
};

export const getCollaborationForms = (user, callback) => {
  const collaborator = { id: user.id, email: user.email, name: user.name };
  const q = query(
    formsRef,
    where("collaborators", "array-contains", collaborator)
  );

  return onSnapshot(q, (snapshot) => {
    const forms = snapshot.docs.map((doc) => {
      const form = doc.data();
      form.id = doc.id;
      form.createdAt = form.createdAt.toDate();
      if (form.settings.startDate) {
        form.settings.startDate = form.settings.startDate.toDate();
      }
      if (form.settings.endDate) {
        form.settings.endDate = form.settings.endDate.toDate();
      }
      return form;
    });

    callback(forms);
  });
};

export const getCollaborationUntreeForms = (user, callback) => {
  const collaborator = { id: user.id, email: user.email, name: user.name };
  const q = query(
    formsRef,
    where("collaborators", "array-contains", collaborator),
    where("treeId", "==", null)
  );

  return onSnapshot(q, (snapshot) => {
    if (snapshot.size === 0) {
      callback([]);
      return null;
    }
    const forms = snapshot.docs.map((doc) => {
      const form = doc.data();
      form.id = doc.id;
      form.createdAt = form.createdAt.toDate();
      if (form.settings.startDate) {
        form.settings.startDate = form.settings.startDate.toDate();
      }
      if (form.settings.endDate) {
        form.settings.endDate = form.settings.endDate.toDate();
      }
      return form;
    });

    callback(forms);
  });
};

export const getFormOnce = async (formId) => {
  try {
    const formRef = doc(db, "forms", formId);

    const form = await getDoc(formRef);

    if (!form.exists()) {
      return null;
    }

    const formData = form.data();
    formData.id = form.id;
    formData.createdAt = formData.createdAt.toDate();
    if (formData.settings.startDate) {
      formData.settings.startDate = formData.settings.startDate.toDate();
    }
    if (formData.settings.endDate) {
      formData.settings.endDate = formData.settings.endDate.toDate();
    }

    const questions = await getQuestionsOnce(formId);

    formData.questions = questions;

    return formData;
  } catch (error) {
    return { error: { message: "Error al buscar la encuesta" } };
  }
};

export const getForm = (id, callback) => {
  const formRef = doc(db, "forms", id);

  return onSnapshot(formRef, (doc) => {
    if (!doc.exists()) {
      return callback(null);
    }

    const form = doc.data();
    form.id = doc.id;
    form.createdAt = form.createdAt.toDate();
    if (form.settings.startDate) {
      form.settings.startDate = form.settings.startDate.toDate();
    }
    if (form.settings.endDate) {
      form.settings.endDate = form.settings.endDate.toDate();
    }
    callback(form);
  });
};

export const getAllTreeForms = (id, callback) => {
  const q = query(formsRef, where("treeId", "==", id));

  return onSnapshot(q, (snapshot) => {
    const forms = snapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
      // const i = tree.children.indexOf(data.id);
      // i !== -1 ? (tree.children[i] = data) : findChildId(tree.subTrees, data);
    });

    callback(forms);
  });
};

export const saveForm = (form) => {
  const { id: formId, ...formData } = form;
  const formRef = doc(db, "forms", formId);
  updateDoc(formRef, formData);
};

export const deleteForm = async (formId) => {
  const formRef = doc(db, "forms", formId);
  const form = await getFormOnce(formId);
  if (!form.treeId) deleteIdFromTree(formId, form.treeId);

  deleteDoc(formRef);
};

export const addCollaborator = async (form, collaboratorEmail) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", collaboratorEmail));
    const users = await getDocs(q);

    if (users.size === 0) {
      return { error: "El usuario no existe" };
    }

    const user = users.docs[0].data();
    user.id = users.docs[0].id;

    const collaborator = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const formRef = doc(db, "forms", form.id);

    updateDoc(formRef, {
      collaborators: arrayUnion(collaborator),
    });

    sendNotification({
      userId: user.id,
      message: `Te han agregado como colaborador en la encuesta "${form.title}"`,
      goto: `/forms/edit/${form.id}`,
    });

    return { formId: formRef.id };
  } catch (error) {
    return { error: { message: "Error al agregar el colaborador" } };
  }
};

export const deleteCollaborator = (form, collaborator) => {
  const formRef = doc(db, "forms", form.id);

  updateDoc(formRef, {
    collaborators: arrayRemove(collaborator),
  });

  sendNotification({
    userId: collaborator.id,
    message: `Te han eliminado como colaborador de la encuesta "${form.title}"`,
    goto: `/forms/edit/${form.id}`,
  });
};
