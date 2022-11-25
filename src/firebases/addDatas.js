import { addDoc, collection, doc, setDoc, setDocs } from "firebase/firestore";
import { db } from "../firebase";

export const addDocData = async ({ collectionName, data, fieldName }) => {
  try {
    const saveSnapshot = await addDoc(collection(db, collectionName), {
      [fieldName]: data,
    });
    console.log(saveSnapshot.id);
  } catch (error) {
    console.log(error.message);
  } finally {
    console.log("addDocData", "Successfully added");
  }
};
