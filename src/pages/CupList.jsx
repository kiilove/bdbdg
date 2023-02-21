import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import CupItem from "../components/CupItem";

import { db } from "../firebase";
const DEFAULT_POSTER =
  "https://firebasestorage.googleapis.com/v0/b/body-36982.appspot.com/o/images%2Fblank%2Fdefault_poster.jpg?alt=media&token=9501d1f2-3e92-45f3-9d54-8d8746ba288d";
const CupList = () => {
  const [resCollections, setResCollections] = useState([]);
  const [posterTitle, setPosterTitle] = useState({});

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

  const getImageTitle = (list) => {
    let getTitle;
    //console.log(list);
    if (Array.isArray(list)) {
      const findTitle = list.filter((item) => item.title === true);
      if (findTitle.lenth) {
        getTitle = findTitle[0];
      } else {
        getTitle = list[0];
      }
    } else if (getTitle === undefined || null) {
      getTitle = { id: 0, link: DEFAULT_POSTER, title: false };
    } else {
      getTitle = { id: 0, link: DEFAULT_POSTER, title: false };
    }

    return getTitle;
  };

  useEffect(() => {
    getCollections();
  }, []);

  useEffect(() => {
    //setPosterTitle(() => getImageTitle(resCollections));
    //console.log(getImageTitle(resCollections.cupInfo.cupPoster));
    console.log(resCollections.cupInfo);
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
            {resCollections.map((item, idx) => {
              const posterTitle = getImageTitle(item.cupInfo.cupPoster);
              posterTitle === (null || undefined) && console.log("ㅜㅜ");
              return (
                <div className="flex">
                  <CupItem
                    cupId={item.id}
                    cupName={item.cupInfo.cupName}
                    cupCount={item.cupInfo.cupCount}
                    cupDate={item.cupInfo.cupDate.startDate}
                    cupState={item.cupInfo.cupState}
                    cupPoster={posterTitle && posterTitle.link}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CupList;
