import { where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import useFirestoreSearch from "./useFirestoreSearch";
import { useOnSanpshotFirestore } from "./useOnSnapshotFirestore";

const useRealtimeSchedule = (cupId) => {
  const { data: scheduleData, loading: isScheduleLoading } =
    useOnSanpshotFirestore("schedule", [
      [where("refCupId", "==", cupId), [where("state", "==", "입장가능")]],
    ]);

  console.log(scheduleData);
  const [entranceOpenGameCategory, setEntranceOpenGameCategory] = useState([]);
  const [beforeStartGameCategory, setBeforeStartGameCategory] = useState([]);
  const [afterEndGameCategory, setAfterEndGameCategory] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!isScheduleLoading && scheduleData.length > 0) {
      const [gameOrderLists] = scheduleData;
      console.log(gameOrderLists);
      const entranceOpenList = gameOrderLists.gameOrderLists.filter(
        (gameCategory) =>
          gameCategory.state === "입장가능" &&
          gameCategory.class.some(
            (classItem) => classItem.players.length > 0
          ) &&
          gameCategory.refereeAssign.some(
            (referee) => referee.refUid === user?.uid
          )
      );
      const beforeStartList = gameOrderLists.gameOrderLists.filter(
        (gameCategory) =>
          gameCategory.state === "시작전" &&
          gameCategory.class.some((classItem) => classItem.players.length > 0)
      );
      const afterEndList = gameOrderLists.gameOrderLists.filter(
        (gameCategory) =>
          gameCategory.state === "종료" &&
          gameCategory.class.some((classItem) => classItem.players.length > 0)
      );
      setEntranceOpenGameCategory(entranceOpenList);
      setBeforeStartGameCategory(beforeStartList);
      setAfterEndGameCategory(afterEndList);
    }
  }, [scheduleData, isScheduleLoading, user]);

  return {
    entranceOpenGameCategory,
    beforeStartGameCategory,
    afterEndGameCategory,
    isScheduleLoading,
  };
};

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};

export { useRealtimeSchedule };
