import { useState, useEffect } from "react";
import {
  getFirestore,
  collectionGroup,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

function useFirestoreCollectionGroups(cupId, collections) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const firestore = getFirestore();
    const queries = collections.map((collection) => {
      const q = query(
        collectionGroup(firestore, collection.name),
        where(collection.fieldName, "==", cupId)
      );
      return { name: collection.name, query: q };
    });

    const unsubscribes = queries.map((queryData) => {
      return onSnapshot(
        queryData.query,
        (snapshot) => {
          const items = [];
          snapshot.forEach((doc) => {
            items.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          setData((prevState) => ({ ...prevState, [queryData.name]: items }));
        },
        (error) => {
          setError(error);
        }
      );
    });

    return () => {
      unsubscribes.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, [cupId, collections]);

  useEffect(() => {
    if (Object.keys(data).length === collections.length) {
      setLoading(false);
    }
  }, [data, collections]);

  if (error) {
    console.error(error);
    return [null, loading, error];
  }

  return [data, loading, null];
}

export default useFirestoreCollectionGroups;
