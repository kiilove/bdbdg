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
import AssignGamesCategory from "../modals/AssignGamesCategory";
import CompleteCup from "../modals/CompleteCup";

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
  const [gamesCategoryPool, setGamesCategoryPool] = useState([]);

  const [refereeAssign, setRefereeAssign] = useState([]);
  const [playerAssign, setPlayerAssign] = useState([]);
  const [gamesCategoryPoolAssign, setGamesCategoryPoolAssign] = useState([]);

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
      component: <NewCupInfo />,
    },
    {
      id: 2,
      title: "심판배정",
      component: <AssignReferees />,
    },

    {
      id: 3,
      title: "종목구성",
      component: <AssignGamesCategory />,
    },
    {
      id: 4,
      title: "마침",
      component: <CompleteCup />,
    },
  ];

  const { dispatch, newCup } = useContext(NewcupContext);

  const handleStep = (action) => {
    switch (action) {
      case "next":
        if (step >= 1 && step < stepsArray.length) {
          setStep((prev) => prev + 1);
          //dispatch({ type: "KEEP", payload: { cupData: cupData, step: step } });
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

  const getGamesCategory = async () => {
    let dataArray = [];

    const gamesCategoryRef = collection(db, "gamesCategory");
    const q = query(gamesCategoryRef, orderBy("index"));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        dataArray.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.log(error);
    }

    return new Promise((resolve, reject) => {
      resolve({ gameList: dataArray });
    });
  };

  const getRefereePool = async () => {
    let dataArray = [];

    const refereeRef = collection(db, "referee");
    const q = query(refereeRef, orderBy("refName"));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        dataArray.push({ id: doc.id, ...doc.data() });
      });
      console.log(dataArray.length);
    } catch (error) {
      console.log(error);
    }

    return new Promise((resolve, reject) => {
      resolve({ refPool: dataArray });
    });
  };

  const handleStart = async () => {
    setIsLoading(true);
    const promises = [getGamesCategory(), getRefereePool()];
    await Promise.all(promises)
      // .then((data) => console.log(data));
      .then((data) => {
        dispatch({
          type: "KEEP",
          payload: {
            cupData: {
              cupInfo: { ...newCup.cupInfo },
              gamesCategory: [...data[0].gameList],
              refereePool: [...data[1].refPool],
              refereeAssign: [],
            },
          },
        });
        return data;
      })
      .then((data) => {
        setGamesCategoryPool(data[0].gamePool);
        setRefereePool(data[1].refPool);
      })
      .then(() => setIsLoading(false))
      .then(() => setStep(2));
  };

  const handleEnd = () => {
    const cupDatas = JSON.parse(localStorage.getItem("newCup"));
    cupDatas !== undefined && setCupData((prev) => (prev = cupDatas));

    addCupData(cupDatas);
  };

  const addCupData = async (datas) => {
    await addDoc(collection(db, "cups"), { ...datas }).then((addDoc) =>
      console.log(addDoc.id)
    );
  };

  const updateSetDoc = async (datas) => {
    try {
      const updateDoc = await setDoc(
        doc(db, "cups", snapshotID),
        { ...datas },
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

  return (
    <div className="flex w-full h-full flex-col gap-y-8">
      <div className="flex w-full gap-x-8 flex-col">
        <div className="flex w-full justify-center items-center p-10 h-20 ">
          <ol className="stepper" style={{ minWidth: "900px" }}>
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
          {step === 1 || step === 5 ? (
            <div className="flex justify-center mt-5">
              <div className="flex">
                {step === 1 ? (
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
                ) : (
                  <button
                    id="menuItemIconBox"
                    className="flex w-40 h-12 justify-center items-center rounded-xl bg-blue-700 hover:bg-sky-500 hover:cursor-pointer"
                    onClick={() => handleEnd()}
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
                      <span className="text-white text-lg font-bold">마침</span>
                    )}
                  </button>
                )}
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
