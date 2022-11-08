import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export const GetDocss = async (props) => {
  let dataArray = [];
  try {
    const resDoc = await getDocs(collection(db, props.documentName));
    resDoc.forEach((doc) => {
      dataArray.push({ id: doc.id, ...doc.data() });
    });
    //console.log(dataArray);
  } catch (error) {
    console.log(error);
  }
  return dataArray;
};
