import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase";

const useFirestoreSnapshot = (collectionPath) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, collectionPath),
      (snapshot) => {
        const newDocs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocs(newDocs);
      }
    );

    return unsubscribe;
  }, [collectionPath]);

  return docs;
};

export default useFirestoreSnapshot;
