import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import useFirestore from "../customhooks/useFirestore";
import Loading from "../pages/Loading";

const EditAssignPlayers = ({ cupId, gameId, gameTitle, gameClass }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [getCupData, setGetCupData] = useState({});
  const [header, setHeader] = useState("header1");
  const [getGame, setGetGame] = useState({});
  const [getJoinData, setGetJoinData] = useState({});
  const {
    data: cupData,
    error: cupError,
    getDocument: cupGetDocument,
  } = useFirestore();

  useMemo(() => {
    setGetCupData({ ...cupData });

    return () => {
      setGetCupData({});
      setGetJoinData({});
    };
  }, [cupData]);

  useMemo(() => {
    if (getCupData.id) {
      console.log(getCupData);
      console.log(gameId);
      const gameClassArray = getCupData.gamesCategory.find(
        (item) => item.id === gameId
      )?.class;

      const classPlayers = gameClassArray.find(
        (item) => item.title === gameClass
      )?.players;

      console.log(classPlayers);
      setIsLoading(false);
    }
  }, [getCupData]);

  useEffect(() => {
    cupGetDocument("cups", cupId);
  }, []);

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border flex-col "
      style={{ minWidth: "600px", maxWidth: "800px" }}
    >
      {isLoading && <Loading />}
      {cupError && console.log("some error")}
      {!isLoading && (
        <>
          <div className="flex w-full flex-col">
            <div className="flex w-full h-10">
              <span className="text-white text-sm">
                {gameTitle} / {gameClass}
              </span>
              <span className="text-white text-sm ml-2">선수명단</span>
            </div>
            <div className="flex w-full">
              <div className="flex w-full border-gray-400 rounded-full bg-slate-800 p-1">
                <div className="flex w-1/3 bg-red-200 justify-center items-center p-2">
                  <label htmlFor="header1">
                    <input
                      type="radio"
                      id="header1"
                      name="header"
                      className="hidden"
                      onClick={(e) => setHeader(e.target.id)}
                    />
                    {header === "header1" ? (
                      <div className="flex w-32 bg-white rounded-full justify-center items-center">
                        <span className="text-black font-semibold flex w-full">
                          등록된 선수
                        </span>
                      </div>
                    ) : (
                      <div className="flex w-full rounded-full justify-center items-center">
                        <span className="text-white font-semibold">
                          등록된 선수
                        </span>
                      </div>
                    )}
                  </label>
                </div>
                <div className="flex w-1/3">
                  <label htmlFor="header2">
                    <input
                      type="radio"
                      id="header2"
                      name="header"
                      className="hidden"
                      onClick={(e) => setHeader(e.target.id)}
                    />
                    {header === "header2" ? (
                      <div className="flex w-full bg-white rounded-full justify-center items-center">
                        <span className="text-black font-semibold">
                          등록된 선수
                        </span>
                      </div>
                    ) : (
                      <div className="flex w-full  rounded-full justify-center items-center">
                        <span className="text-white font-semibold">
                          등록된 선수
                        </span>
                      </div>
                    )}
                  </label>
                </div>
                <div className="flex w-1/3">
                  <label htmlFor="header3">
                    <input
                      type="radio"
                      id="header3"
                      name="header"
                      className="hidden"
                      onClick={(e) => setHeader(e.target.id)}
                    />
                    {header === "header3" ? (
                      <div className="flex w-full bg-white rounded-full justify-center items-center">
                        <span className="text-black font-semibold">
                          등록된 선수
                        </span>
                      </div>
                    ) : (
                      <div className="flex w-full  rounded-full justify-center items-center">
                        <span className="text-white font-semibold">
                          등록된 선수
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditAssignPlayers;
