import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const addDocData = async (props) => {
  try {
    const saveSnapshot = await setDoc(collection(db, props.collectionName), {
      [props.fieldName]: props.data,
    });
    saveSnapshot;
  } catch (error) {
    console.log(error.message);
  } finally {
    console.log("addDocData", "Successfully added");
  }
};
