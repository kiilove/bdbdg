import React, { useState } from "react";
import { getDocsData } from "../firebases/getDatas";

export const MakeResData = (props) => {
  //props.setResData((prev) => (prev = 1));
  const getDatas = async () => {
    try {
      await getDocsData({
        collectionName: props.collectionName,
        documentName: props.documentName,
      }).then((res) => {
        props.setResData(res);
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      console.log("getDatas Finished");
    }
  };

  if (!props.documentName) {
    getDatas({ collectionName: props.collectionName });
  } else if (props.documentName) {
    getDatas({
      collectionName: props.collectionName,
      documentName: props.documentName,
    });
  }
};
