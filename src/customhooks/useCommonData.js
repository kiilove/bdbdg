import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useCommonData(collectionNames, queries, refId) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      //console.log(collectionNames);
      const db = getFirestore();

      const promises = collectionNames
        .map((name, index) => {
          const colRef = collection(db, name);
          const queryObj = queries[index];
          if (queryObj) {
            //console.log(queryObj);
            return query(colRef, ...queryObj);
          } else {
            //console.log(colRef);
            return colRef;
          }
        })
        .map((col) => getDocs(col));

      const results = await Promise.all(promises);

      const data = results.flatMap((querySnapshot, index) => {
        return querySnapshot.docs.map((doc) => {
          const item = doc.data();
          return { [collectionNames[index]]: item };
        });
      });

      setData(data);
    };

    fetchData();
  }, [collectionNames, queries, refId]);

  return data;
}
