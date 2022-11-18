import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getDocsData = async (props) => {
  let dataArray = [];
  try {
    const resDocs = await getDocs(collection(db, props.collectionName));
    resDocs.forEach((docs) => {
      dataArray.push({ id: docs.id, ...docs.data() });
    });
  } catch (error) {
    console.log(error.message);
  } finally {
    //console.log(dataArray);
    return dataArray;
  }
};
