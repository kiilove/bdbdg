import { dialogClasses } from "@mui/material";
import {
  collection,
  DocumentSnapshot,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

import CupItem from "../components/CupItem";

import { db } from "../firebase";

const CupList = () => {
  const [resCollections, setResCollections] = useState([]);

  let dataArray = [];
  let resDocs;
  const getCollections = async () => {
    try {
      resDocs = await getDocs(collection(db, "cups"));
      resDocs.forEach((doc) => {
        dataArray.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      setResCollections(dataArray);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  useEffect(() => {
    console.log(resCollections);
  }, [resCollections]);

  return (
    <div className="flex w-full h-full flex-col gap-y-5">
      <div className="flex w-full flex-col">
        <div className="flex w-full p-5 h-36 justify-center align-middle">
          <div
            className="flex w-full h-full p-5 box-border items-center rounded-lg"
            style={{ backgroundColor: "rgba(7,11,41,0.7)" }}
          >
            <span className="text-white">협회</span>
          </div>
        </div>
        <div className="flex w-full px-5">
          <div className="flex w-full flex-wrap box-border justify-between gap-y-5">
            {resCollections.map((item, idx) => (
              <div className="flex">
                <CupItem
                  cupId={item.id}
                  cupName={item.cupInfo.cupName}
                  cupCount={item.cupInfo.cupCount}
                  cupDate={item.cupInfo.cupDate}
                  cupPoster={item.cupInfo.cupPoster}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CupList;
