import React, { useEffect, useState } from "react";
import "./stepper.css";
import {
  NewCup,
  SelectMembers,
  SelectPlayers,
  SelectReferees,
  Startpage,
} from "../components/Modals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { MakeResData, MakeTableData } from "../components/MakeResData";
import { addDocData } from "../firebases/addDatas";
import { ThreeDots } from "react-loader-spinner";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { NewCupInfo } from "../modals/NewCupInfo";

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
  const [refereeAssign, setRefereeAssign] = useState([]);
  const [playerAssign, setPlayerAssign] = useState([]);
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
        <NewCupInfo isPage={true} setCupInfo={setCupInfo} cupInfo={cupInfo} />
      ),
    },
    {
      id: 2,
      title: "심판배정",
      component: (
        <SelectReferees
          poolData={resRefereeData}
          assignData={refereeAssign}
          setRefereeAssign={setRefereeAssign}
        />
      ),
    },
    {
      id: 3,
      title: "선수선발",
      component: (
        <SelectPlayers
          poolData={resPlayerData}
          assignData={playerAssign}
          setPlayerAssign={setPlayerAssign}
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
    console.log(cupInfo);
  };

  const handleInputUpdate = () => {
    setCups({
      cupInfo,
      refrees: refereeAssign,
      players: playerAssign,
      gameInfo,
    });
  };

  useEffect(() => {
    handleInputUpdate();

    if (step < 1) {
      setStep((prev) => (prev = 1));
    } else if (step >= stepsArray.length) {
      setStep((prev) => (prev = stepsArray.length));
    }
    //console.log(step);
  }, [step, refereeAssign, playerAssign, cupInfo]);

  const updateSetDoc = async () => {
    try {
      const updateDoc = await setDoc(
        doc(db, "cups", snapshotID),
        { cups },
        { merge: true }
      );
      console.log("temp", updateDoc);
    } catch (error) {
      console.log(error.message);
    } finally {
      console.log("updateSetDoc", "Successfully updated");
    }
  };
  useEffect(() => {
    console.log(cups);
    console.log(snapshotID);
    snapshotID && updateSetDoc();
  }, [cups]);

  useEffect(() => {
    MakeResData({ setResData: setResRefereeData, collectionName: "referee" });
    MakeResData({ setResData: setResPlayerData, collectionName: "player" });
  }, []);

  useEffect(() => {
    console.log("refereeData", resRefereeData);
  }, [resRefereeData]);

  useEffect(() => {
    console.log("playerData", resPlayerData);
  }, [resPlayerData]);

  useEffect(() => {
    console.log("refereeAssign", refereeAssign);
  }, [refereeAssign]);

  useEffect(() => {
    if (snapshotID.length > 0) {
      setStep(2);
    }
    MakeResData({
      setResData: setRefereeAssign,
      collectionName: "cups",
      documentName: snapshotID,
    });
  }, [snapshotID]);

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
