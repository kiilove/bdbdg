import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getDocsData = async (props) => {
  let dataArray = [];
  let resDocs;
  try {
    if (props.documentName) {
      console.log(props.collectionName);
      resDocs = await getDoc(doc(db, props.collectionName, props.documentName));
      dataArray.push({ ...resDocs.data() });
    } else {
      resDocs = await getDocs(collection(db, props.collectionName));
      resDocs.forEach((docs) => {
        dataArray.push({ id: docs.id, ...docs.data() });
      });
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    //console.log(dataArray);
    return dataArray;
  }
};
