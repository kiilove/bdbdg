import { useState, useEffect } from "react";
import {
  collectionGroup,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

const cupsCollection = collectionGroup(db, "cups");

const getCupsInApplication = async () => {
  const q = query(
    cupsCollection,
    where("cupInfo.cupState", "==", "신청접수중")
  );
  const querySnapshot = await getDocs(q);
  const cups = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return cups;
};

const useRealtimeCupsInApplication = () => {
  const [getCupDatas, setCupDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(cupsCollection, where("cupInfo.cupState", "==", "대회중"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCupDatas(data);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);
  console.log(getCupDatas);
  return { getCupDatas, isLoading };
};

const getRealtimeCupsInApplication = async () => {
  const q = query(
    cupsCollection,
    where("cupInfo.cupState", "==", "신청접수중")
  );
  const querySnapshot = await getDocs(q);
  const cups = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
  return cups;
};

export { getRealtimeCupsInApplication, useRealtimeCupsInApplication };
