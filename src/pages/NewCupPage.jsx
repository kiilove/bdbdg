import React, { useContext, useEffect, useMemo, useState } from "react";
import "./stepper.css";
import { SelectPlayers, SelectReferees, Startpage } from "../components/Modals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

import { ThreeDots } from "react-loader-spinner";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { NewCupInfo } from "../modals/NewCupInfo";
import { EditCupInfo } from "../modals/EditCupInfo";
import { DEFAULT_CUP_POSTER, DEFAULT_POSTER } from "../const/front";
import AssignReferees from "../modals/AssignReferees";
import { NewcupContext } from "../context/NewcupContext";

const NewCupPage = () => {
  const currentNewCup = JSON.parse(localStorage.getItem("newCup"));
  const [cupInfo, setCupInfo] = useState(currentNewCup.cupInfo);
  const [refereeInfo, setRefereeInfo] = useState({});
  const [playerInfo, setPlayerInfo] = useState({});
  const [gameInfo, setGameInfo] = useState({});
  const [cupData, setCupData] = useState(currentNewCup);
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
      component: <NewCupInfo prevSetState={setCupInfo} prevState={cupInfo} />,
    },
    {
      id: 2,
      title: "심판배정",
      component: (
        <AssignReferees
          cupId={snapshotID}
          setRefereeAssign={setRefereeAssign}
        />
      ),
    },

    { id: 4, title: "종목구성" },
  ];

  const { dispatch } = useContext(NewcupContext);

  const handleStep = (action) => {
    switch (action) {
      case "next":
        if (step >= 1 && step < stepsArray.length) {
          setStep((prev) => prev + 1);
          dispatch({ type: "STEP", payload: { cupData: cupData, step: step } });
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

  const handleStart = async () => {
    setStep(2);
  };

  // const handleStart = async () => {
  //   setIsLoading(true);
  //   try {
  //     const snapShot = await addDoc(collection(db, "cups"), {
  //       cupInfo: {
  //         cupName: "",
  //       },
  //     });
  //     setSnapshotID(snapShot.id);
  //   } catch (error) {
  //     console.log(error.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // const handleCupDataWithInputChange = () => {
  //   if (cupInfo.cupPoster == undefined) {
  //     setCupInfo({
  //       ...cupInfo,
  //       cupPoster: [{ id: 1, link: DEFAULT_CUP_POSTER, title: true }],
  //     });
  //   }
  //   setCupData({
  //     cupInfo,
  //     refereeAssign,
  //     playerAssign,
  //   });
  // };

  const updateSetDoc = async () => {
    try {
      const updateDoc = await setDoc(
        doc(db, "cups", snapshotID),
        { ...cupData },
        { merge: true }
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (step < 1) {
      setStep((prev) => (prev = 1));
    } else if (step >= stepsArray.length) {
      setStep((prev) => (prev = stepsArray.length));
    }
  }, [step]);

  useMemo(
    () => setCupData((prev) => ({ ...prev, cupInfo, refereeAssign })),
    [cupInfo, refereeAssign]
  );
  useMemo(() => console.log("cupData 추적", cupData), [cupData]);
  useMemo(
    () => dispatch({ type: "KEEP", payload: { cupData, step } }),
    [cupData]
  );

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
