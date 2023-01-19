import React, { useEffect, useState } from "react";
import "./stepper.css";
import { NewCup, SelectMembers, Startpage } from "../components/Modals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { MakeResData, MakeTableData } from "../components/MakeResData";
import { addDocData, updateSetDoc } from "../firebases/addDatas";
import { ThreeDots } from "react-loader-spinner";

const NewCupPage = () => {
  const [cupInfo, setCupInfo] = useState({});
  const [refereeInfo, setRefereeInfo] = useState({});
  const [playerInfo, setPlayerInfo] = useState({});
  const [gameInfo, setGameInfo] = useState({});
  const [cups, setCups] = useState({});
  const [resRefereeData, setResRefereeData] = useState([]);
  const [resPlayerData, setResPlayerData] = useState([]);

  const [refereePool, setRefereePool] = useState([]);
  const [playerPool, setPlayerPool] = useState([]);
  const [refereeAssign, setRefereeAssign] = useState({});
  const [playerAssign, setPlayerAssign] = useState({});
  const [step, setStep] = useState(1);
  const [snapshotID, setSnapshotID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const stepsArray = [
    {
      id: 0,
      title: "시작하기",
      component: <Startpage />,
    },
    {
      id: 1,
      title: "대회정보",
      component: (
        <NewCup isPage={true} setCupInfo={setCupInfo} cupInfo={cupInfo} />
      ),
    },
    {
      id: 2,
      title: "심판배정",
      component: (
        <SelectMembers
          isPage={true}
          rootData={refereePool}
          type="referee"
          setRebuildAssign={setRefereeAssign}
        />
      ),
    },
    {
      id: 3,
      title: "선수선발",
      component: (
        <SelectMembers
          isPage={true}
          rootData={playerPool}
          type="player"
          setRebuildAssign={setPlayerAssign}
        />
      ),
    },
    { id: 4, title: "종목구성" },
  ];

  const handleStep = (action) => {
    switch (action) {
      case "next":
        if (step >= 1 && step < stepsArray.length) {
          setStep((prev) => prev + 1);
        }
        break;
      case "prev":
        if (step > 1) {
          setStep((prev) => prev - 1);
        } else if (step <= 0) {
          setStep((prev) => (prev = 1));
        }
        break;
      default:
        setStep((prev) => (prev = 1));
        break;
    }
  };

  const handleStart = () => {
    addDocData({
      collectionName: "cups",
      data: cupInfo,
      fieldName: "basicInfo",
      setSnapshotID,
      setIsLoading,
    });
  };

  const handleUpdate = () => {
    setCups((prev) => (prev = { cupInfo, refereeInfo, playerInfo, gameInfo }));
    console.log(cups);
    console.log("심판Info", refereeInfo);
  };
  useEffect(() => {
    handleUpdate();

    if (step < 1) {
      setStep((prev) => (prev = 1));
    } else if (step >= stepsArray.length) {
      setStep((prev) => (prev = stepsArray.length));
    }
    //console.log(step);
  }, [step, refereeAssign, playerAssign]);

  useEffect(() => {
    updateSetDoc({
      collectionName: "cups",
      data: cups,
      snapshotID,
      setIsLoading,
    });
    console.log(cups);
  }, [cups]);

  useEffect(() => {
    MakeResData({ setResData: setResRefereeData, collectionName: "referee" });
    MakeResData({ setResData: setResPlayerData, collectionName: "player" });
  }, []);

  useEffect(() => {
    // 선택된 심판 있다면 전체 목록에서 선택된 심판 제외시킨후 refrereePool설정
    if (refereeAssign) {
      const refereeRemovedAssign = resRefereeData.filter(
        (item) => !refereeAssign.includes(item)
      );
      setRefereePool(
        MakeTableData(refereeRemovedAssign, { collectionName: "referee" })
      );
    } else {
      setRefereePool(
        MakeTableData(resRefereeData, { collectionName: "referee" })
      );
    }

    // 선택된 선수가 있다면 전체 목록에서 선택된 선수 제외시킨후 playerPool설정
    if (playerAssign) {
      const playerRemovedAssign = resPlayerData.filter(
        (item) => !playerAssign.includes(item)
      );
      setPlayerPool(
        MakeTableData(playerRemovedAssign, { collectionName: "player" })
      );
    } else {
      setPlayerPool(MakeTableData(resPlayerData, { collectionName: "player" }));
    }

    console.log("심판선택", refereeAssign);
    console.log("선수선택", playerAssign);
    //console.log(MakeTableData(resData, { collectionName: "referee" }));
  }, [refereeAssign, playerAssign]);

  useEffect(() => {
    if (snapshotID.length > 0) {
      setStep(2);
    }
    MakeResData({
      setResData: setRefereeAssign,
      collectionName: "cups",
      documentName: snapshotID,
    });

    MakeResData({
      setResData: setPlayerAssign,
      collectionName: "cups",
      documentName: snapshotID,
    });
  }, [snapshotID]);

  useEffect(() => {
    console.log(cupInfo);
  }, [cupInfo]);

  useEffect(() => {
    setRefereeInfo({ assign: refereeAssign });
    setPlayerInfo({ assign: playerAssign });
  }, [refereeAssign, playerAssign]);
  return (
    <div className="flex w-full h-full flex-col gap-y-8">
      <div className="flex w-full gap-x-8 flex-col">
        <div className="flex w-full justify-center items-center p-10 h-20">
          <ol className="stepper">
            {stepsArray.map((item, idx) =>
              idx <= step - 1 ? (
                <li className="stepper-item-active">
                  <div className="">
                    <h3 className="text-white my-3 font-semibold">
                      {item.title}
                    </h3>
                  </div>
                </li>
              ) : (
                <li className="stepper-item before:bg-blue-500">
                  <div className="">
                    <h3 className="text-white my-3">{item.title}</h3>
                  </div>
                </li>
              )
            )}
          </ol>
        </div>
      </div>
      <div className="flex w-full gap-x-8 flex-col justify-center items-center">
        <div
          className="flex w-3/5 rounded-lg p-10 flex-col"
          style={{ backgroundColor: "rgba(7,11,41,0.5)", minWidth: "900px" }}
        >
          <div className="flex w-full">{stepsArray[step - 1].component}</div>
          {step === 1 ? (
            <div className="flex justify-center mt-5">
              <div className="flex">
                <button
                  id="menuItemIconBox"
                  className="flex w-40 h-12 justify-center items-center rounded-xl bg-blue-700 hover:bg-sky-500 hover:cursor-pointer"
                  onClick={() => handleStart()}
                >
                  {isLoading ? (
                    <ThreeDots
                      height="80"
                      width="80"
                      radius="9"
                      color="#fff"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  ) : (
                    <span className="text-white text-lg font-bold">
                      시작하기
                    </span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between mt-5">
              <div className="flex">
                <button
                  id="menuItemIconBox"
                  className="flex w-20 h-10 justify-center items-center rounded-xl bg-blue-700 hover:bg-sky-500 hover:cursor-pointer"
                  onClick={() => handleStep("prev")}
                >
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="text-xl text-white font-extrabold"
                  />
                </button>
              </div>
              <div className="flex">
                <button
                  id="menuItemIconBox"
                  className="flex w-20 h-10 justify-center items-center rounded-xl bg-blue-700 hover:bg-sky-500 hover:cursor-pointer"
                  onClick={() => handleStep("next")}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-xl text-white font-extrabold"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCupPage;
