import { addDoc, collection, doc, setDoc, setDocs } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";

export const addDocData = async ({
  collectionName,
  data,
  fieldName,
  setSnapshotID,
  setIsLoading,
}) => {
  setIsLoading(true);
  try {
    const saveSnapshot = await addDoc(collection(db, collectionName), {
      [fieldName]: data,
    });
    console.log(saveSnapshot.id);
    setSnapshotID(saveSnapshot.id);
  } catch (error) {
    console.log(error.message);
  } finally {
    console.log("addDocData", "Successfully added");
    setIsLoading(false);
  }
};

export const updateSetDoc = async ({
  collectionName,
  data,
  snapshotID,
  setIsLoading,
}) => {
  setIsLoading(true);
  console.log("update", data);
  try {
    const updateDoc = await setDoc(
      doc(db, collectionName, snapshotID),
      {
        data,
      },
      { merge: true }
    );
    //console.log(updateDoc);
  } catch (error) {
    console.log(error.message);
  } finally {
    console.log("updateSetDoc", "Successfully updated");
    setIsLoading(false);
  }
};
