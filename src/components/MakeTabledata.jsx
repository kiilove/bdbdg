import { getDocsData } from "../firebases/getDatas";
import { useState } from "react";
import { useEffect } from "react";
const makeTableDatas = (rows, props) => {
  let madeData = {};
  let rowsArray = [];
  let madeRows = [];

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
  console.log("makeTableDatas finished");
  return rowsArray;
};

const getDatas = async (props) => {
  let resDatas = [];
  try {
    await getDocsData({ collectionName: props.collectionName }).then((res) => {
      resDatas.push(res);
    });
  } catch (error) {
    console.log(error.message);
  } finally {
    console.log("getDatas Finished");
    return resDatas;
  }
};
export const MakeTabledata = (props) => {
  // const [resGetDatas, setResGetDatas] = useState([]);
  // const [resTableDatas, setResTableDatas] = useState([]);
  //const [resGetDatas, setResGetDatas] = useState([]);

  console.log(getDatas({ collectionName: props.collectionName }));

  // useEffect(() => {
  //   setResTableDatas(
  //     (prev) =>
  //       (prev = makeTableDatas(resGetDatas, {
  //         collectionName: props.collectionName,
  //       }))
  //   );
  // }, [resGetDatas]);
  // return resTableDatas;
  // console.log(props.res);
};
