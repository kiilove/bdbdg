import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";

const useOnSanpshotFirestore = (collectionName, queryOptions = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q;
    if (queryOptions) {
      q = query(collection(db, collectionName), ...queryOptions);
    } else {
      q = collection(db, collectionName);
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName, queryOptions]);

  return { data, loading };
};

export { useOnSanpshotFirestore };
