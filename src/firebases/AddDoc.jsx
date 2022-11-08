import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebase";

export const AddDoc = async (props) => {
  const propData = props.datas;
  console.log(propData);

  try {
    const saveDoc = await setDoc(
      doc(db, props.documentName, props.collectionName),
      { basicInfo: propData }
    );
    console.log(saveDoc);
    return { title: "success", info: saveDoc };
  } catch (error) {
    console.log(error);
    return { title: "error", message: error.message };
  }
};
