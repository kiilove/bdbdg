import React, { useState } from "react";
import { getDocsData } from "../firebases/getDatas";

export const MakeTableData = (rows, props) => {
  let madeData = {};
  let rowsArray = [];
  let madeRows = [];
  //console.log(props.collectionName);
  if (props.collectionName === "referee") {
    madeRows = rows.map((item, idx) => {
      rowsArray.push([
        item.basicInfo.refId,
        item.basicInfo.refName,
        item.basicInfo.refEmail,
      ]);
    });
  } else if (props.collectionName === "player") {
    madeRows = rows.map((item, idx) => {
      rowsArray.push([
        item.basicInfo.playerId,
        item.basicInfo.playerName,
        item.basicInfo.playerEmail,
      ]);
    });
  }
  console.log("테이블데이터", rowsArray);
  console.log("makeTableDatas finished");
  return rowsArray;
};

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
