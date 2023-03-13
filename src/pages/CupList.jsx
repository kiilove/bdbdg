import React, { useEffect, useMemo, useState } from "react";
import CupItem from "../components/CupItem";
import useFirestore from "../customhooks/useFirestore";
import useFirestoreSearch from "../customhooks/useFirestoreSearch";

const CupList = () => {
  const [getCupsList, setGetCupsList] = useState([]);
  const [titlePoster, setTitlePoster] = useState();
  //const { data, error, loading } = useFirestoreSearch();
  const { data: cupListsData, readData: cupListsReadData } = useFirestore();

  useMemo(() => {
    if (!getCupsList.length) {
      return;
    }
  }, [getCupsList]);
  useMemo(() => {
    if (!cupListsData.length) {
      return;
    }
    setGetCupsList([...cupListsData]);
  }, [cupListsData]);

  useEffect(() => {
    cupListsReadData("cups");

    return () => {
      setGetCupsList([]);
    };
  }, []);

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
            {cupListsData.map((cup, idx) => (
              <div className="flex">
                <CupItem
                  cupId={cup.id}
                  cupName={
                    cup.cupInfo.cupName ? cup.cupInfo.cupName : "준비중 대회"
                  }
                  cupCount={
                    cup.cupInfo.cupCount ? cup.cupInfo.cupCount : "데이터불안정"
                  }
                  cupDate={
                    cup.cupInfo.cupDate.startDate
                      ? cup.cupInfo.cupDate.startDate
                      : "데이터불안정"
                  }
                  cupState={
                    cup.cupInfo.cupState ? cup.cupInfo.cupState : "데이터불안정"
                  }
                  cupPoster={
                    cup.cupInfo.cupPoster.length
                      ? cup.cupInfo.cupPoster[0].link
                      : ""
                  }
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
