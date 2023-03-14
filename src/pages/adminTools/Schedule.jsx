import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useOnSanpshotFirestore } from "../../customhooks/useOnSnapshotFirestore";
import SchedulePage from "./SchedulePage";

const Schedule = () => {
  const [cupId, setCupId] = useState("");
  const queryOptions = [where("cupInfo.cupState", "==", "대회중")];
  const {
    data: realtimeCupsInApplication,
    loading: isRealtimeCupsInApplicationLoading,
  } = useOnSanpshotFirestore("cups", queryOptions);
  return (
    <div className="flex w-full bg-gray-900 text-white h-full flex-col justify-start items-center p-2 gap-y-2">
      {isRealtimeCupsInApplicationLoading ? (
        <div className="flex justify-center items-center text-white">
          Loading...
        </div>
      ) : (
        <div className="flex justify-start items-center w-full  flex-col">
          <div className="flex w-full h-full justify-start items-center gap-x-2">
            {realtimeCupsInApplication.map((cup) => (
              <button
                key={cup.id}
                onClick={() => setCupId(cup.id)}
                className="flex justify-center items-center bg-gray-700 p-3"
              >
                {cup.cupInfo.cupName}
              </button>
            ))}
          </div>
          <div className="flex" style={{ minWidth: "800px" }}>
            <SchedulePage cupId={cupId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
