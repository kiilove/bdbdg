import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const useOnSanpshotFirestore = (
  collectionName,
  queryOptions = null,
  limitNum = null
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(true);

  useEffect(() => {
    let q;
    if (queryOptions) {
      q = query(collection(db, collectionName), ...queryOptions);
    } else {
      q = collection(db, collectionName);
    }

    if (limitNum) {
      q = query(q, limit(limitNum)); // query 객체에 limit 조건을 추가합니다.
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        refCupId: doc.get("refCupId"),
        id: doc.id,
      }));
      setData(data);
      setLoading(false);
    });

    // isSubscribed가 true일 때에만 구독을 진행
    if (!isSubscribed) {
      return unsubscribe;
    }
  }, [collectionName, queryOptions, limitNum, isSubscribed]);

  const handleToggleSubscribed = () => {
    setIsSubscribed(!isSubscribed);
  };
  return { data, loading, isSubscribed, handleToggleSubscribed };
};

export { useOnSanpshotFirestore };
