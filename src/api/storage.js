import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./firebaseConfig";
import { v4 as uuidv4 } from "uuid";

export const uploadFiles = async (files) => {
  const date = Date.now();
  const snapshots = await Promise.all(
    files.map((file) => {
      const fileRef = ref(storage, `${date + file.name}`);
      return uploadBytes(fileRef, file);
    })
  );

  const downloadUrls = await Promise.all(
    snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
  );

  return snapshots.map((snapshot, i) => ({
    url: downloadUrls[i],
    type: snapshot.metadata.contentType,
    name: files[i].name,
    date,
  }));
};

export const deleteFile = async (fileName) => {
  const fileRef = ref(storage, fileName);

  return await deleteObject(fileRef);
};

export const uploadRecordedAudio = async (audio, text) => {
  const name = uuidv4();
  const fileRef = ref(storage, `${Date.now() + name}`);
  const file = await uploadBytes(fileRef, audio);

  const url = await getDownloadURL(fileRef);

  return {
    url,
    type: file.metadata.contentType,
    name,
    text,
  };
};
