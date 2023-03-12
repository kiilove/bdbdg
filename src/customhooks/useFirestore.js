import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const useFirestore = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDocument = async (collectionName, collectionId) => {
    try {
      const docSnapshot = await getDoc(doc(db, collectionName, collectionId));
      if (docSnapshot.exists()) {
        setData({ id: docSnapshot.id, ...docSnapshot.data() });
      } else {
        setError({ message: "Document does not exist" });
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const readData = async (collectionName) => {
    console.log(collectionName);
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(documents);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const addData = async (collectionName, newData, callback) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), newData);
      const addedData = { ...newData, id: docRef.id };
      setData(() => ({ ...addedData }));
      callback && callback(addedData);
      return addedData;
    } catch (error) {
      setError(error);
    } finally {
      setData("");
    }
  };

  const deleteData = async (collectionName, id, callback) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      setData((prevState) => prevState.filter((item) => item.id !== id));
      callback && callback();
    } catch (error) {
      setError(error);
    }
  };

  const updateData = async (collectionName, id, newData, callback) => {
    try {
      const docRef = await updateDoc(doc(db, collectionName, id), newData);
      const updatedData = { ...docRef.data(), id: docRef.id };
      callback && callback(updatedData);
      return updatedData;
    } catch (error) {
      setError(error);
    } finally {
      setData("");
    }
  };

  return {
    data,
    loading,
    error,
    getDocument,
    readData,
    addData,
    deleteData,
    updateData,
  };
};

export default useFirestore;
