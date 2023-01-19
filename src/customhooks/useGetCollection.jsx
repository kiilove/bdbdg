import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";

export const useGetCollections = async ({ collectionName, setReturnState }) => {
  const [getCollections, setGetCollections] = useState([]);
  let dataArray = [];
  let resDocs;

  try {
    resDocs = await getDocs(collection(db, collectionName));
    resDocs.forEach((docs) => {
      dataArray.push({ id: docs.id, ...docs.data() });
    });
  } catch (error) {
    console.log(error.message);
  } finally {
    setGetCollections(dataArray);
  }
  return getCollections;
  //console.log(getCollections);
};
