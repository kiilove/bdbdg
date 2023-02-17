import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, limit, query } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import WidgetWithTable from "../components/WidgetWithTable";
import { db } from "../firebase";
const REFEREE_HEADERS = ["ID", "이름", "이메일"];
const CUPS_HEADERS = ["대회명", "일자", "상태"];

const Dashboard = () => {
  const [cupsData, setCupsData] = useState([]);
  const [cupsTableData, setCupsTableData] = useState([]);
  const getCups = async () => {
    let dataArray = [];
    try {
      const cupRef = collection(db, "cups");
      const cupQ = query(cupRef, limit(5));
      const querySnapshot = await getDocs(cupQ);
      querySnapshot.forEach((doc) => {
        dataArray.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.log(error);
    }

    return new Promise((resolve, reject) => {
      resolve(setCupsData(dataArray));
    });
  };

  const makeTableData = (rows, action) => {
    let rowsArray = [];
    let madeRows = [];

    switch (action) {
      case "referee":
        madeRows = rows.map((item, idx) => {
          rowsArray.push([item.refUid, item.refName, item.refEmail]);
        });
      case "player":
        madeRows = rows.map((item, idx) => {
          rowsArray.push([item.playerUid, item.pName, item.pEmail]);
        });
      case "cups":
        madeRows = rows.map((item, idx) => {
          rowsArray.push([
            item.cupInfo.cupName,
            item.cupInfo.cupDate,
            item.cupState,
          ]);
        });
      default:
    }

    console.log("makeTableDatas finished");
    return rowsArray;
  };

  useMemo(() => getCups(), []);
  useMemo(() => setCupsTableData(makeTableData(cupsData, "cups")), [cupsData]);
  return (
    <div className="flex w-full h-full flex-col gap-y-8">
      <div className="flex w-full gap-x-8">
        <div className="flex w-1/2 h-96">
          <WidgetWithTable
            data={{
              title: "대회",
              titleIcon: faScaleBalanced,
              tableHeaders: CUPS_HEADERS,
              tableData: cupsTableData,
              modalComponent: "",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
