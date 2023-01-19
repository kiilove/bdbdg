import React, { useEffect, useState } from "react";
import CupItem from "../components/CupItem";
import { MakeResData } from "../components/MakeResData";

const GameList = () => {
  const [resCupListData, setResCupListData] = useState([]);
  useEffect(() => {
    MakeResData({ setResData: setResCupListData, collectionName: "cups" });
  }, []);

  useEffect(() => {
    console.log(resCupListData);
  }, [resCupListData]);
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
            {resCupListData &&
              resCupListData.map((item, idx) => (
                <div className="flex">
                  <CupItem id={item.id} data={item.basicInfo} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameList;
