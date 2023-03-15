import { limit, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import useFirestoreSearch from "./useFirestoreSearch";
import { useOnSanpshotFirestore } from "./useOnSnapshotFirestore";

const useRealtimeSchedule = (cupId) => {
  const { data: scheduleData, loading: isScheduleLoading } =
    useOnSanpshotFirestore("schedule", [where("refCupId", "==", cupId)], 1);

  console.log(scheduleData);
  const [entranceOpenGameCategory, setEntranceOpenGameCategory] = useState([]);
  const [beforeStartGameCategory, setBeforeStartGameCategory] = useState([]);
  const [afterEndGameCategory, setAfterEndGameCategory] = useState([]);

  useEffect(() => {}, [scheduleData]);

  return {
    entranceOpenGameCategory,
    beforeStartGameCategory,
    afterEndGameCategory,
    isScheduleLoading,
  };
};

export { useRealtimeSchedule };
