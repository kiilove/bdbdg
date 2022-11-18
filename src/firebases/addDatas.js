import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const addDocData = async (props) => {
  try {
  } catch (error) {
    const saveSnapshot = await setDoc(collection(db, props.collectionName), {
      [props.fieldName]: props.data,
    });
    saveSnapshot;
    console.log(error.message);
  } finally {
    console.log("addDocData", "Successfully added");
  }
};
