import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRealtimeCupsInApplication } from "../../customhooks/useRealTimeStore";

const Schedule = () => {
  const { getCupDatas, isLoading } = useRealtimeCupsInApplication();
  console.log(getCupDatas);

  return (
    <div className="flex w-full bg-gray-900 text-white h-full flex-col justify-start items-center p-2 gap-y-2">
      {isLoading ? (
        <div className="flex justify-center items-center text-white">
          Loading...
        </div>
      ) : (
        <ul>
          {getCupDatas.map((cup) => (
            <li key={cup.id}>{cup.cupInfo.cupName}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Schedule;
