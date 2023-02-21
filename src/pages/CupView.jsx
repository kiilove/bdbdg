import React, { useCallback, useContext, useMemo, useReducer } from "react";
import { Modal } from "@mui/material";
import { widgetTitle } from "../components/Titles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faPeopleLine,
  faPlus,
  faScaleBalanced,
  faSitemap,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import WidgetWithTable from "../components/WidgetWithTable";
import { useState } from "react";
import { useEffect } from "react";
import WidgetWithTableDragable from "../components/WidgetWithTableDragable";

import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Bars } from "react-loader-spinner";
import { NewCupInfo } from "../modals/NewCupInfo";
import { EditCupInfo } from "../modals/EditCupInfo";
import { EditcupContext } from "../context/EditcupContext";
import { Decrypter } from "../components/Encrypto";
import GameCategoryTable from "../components/GameCategoryTable";
import EditAssignReferees from "../modals/EditAssignReferees";
const REFEREE_HEADERS = ["이름", "이메일", "연락처"];
const PLAYER_HEADERS = ["ID", "이름", "이메일"];

const GAME_HEADERS = [
  { title: "경기순서", size: "10%" },
  { title: "종목명", size: "15%" },
  { title: "체급", size: "30%" },
  { title: "참가신청 선수", size: "10%" },
  { title: "배정된 심판", size: "10%" },
  { title: "액션", size: "10%" },
];

const CupView = () => {
  const params = useParams();
  const [cupId, setCupId] = useState(params.cupId);
  const [cupInfo, setCupInfo] = useState({});
  const [cupOrg, setCupOrg] = useState("");
  const [cupState, setCupState] = useState("대회준비중");

  const [cupDate, setCupDate] = useState({});
  const [posterList, setPosterList] = useState([...(cupInfo.cupPoster || [])]);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch, editCup } = useContext(EditcupContext);

  const handleOpenModal = ({ component }) => {
    setModalComponent(() => component);
    setModal(() => true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(() => false);
  };

  useEffect(() => {
    setCupId(() => params.cupId);
  }, [params]);

  const getCup = async () => {
    setIsLoading(true);
    await getDoc(doc(db, "cups", cupId))
      .then((data) => {
        dispatch({
          type: "EDIT",
          payload: { cupData: { ...data.data() } },
        });
      })
      .then(() => setIsLoading(false))
      .catch((error) => console.log(error));
  };
  const updateCup = async (data) => {
    (data.cupInfo.cupName !== undefined ||
      data.cupInfo.cupCount !== undefined) &&
      (await setDoc(doc(db, "cups", cupId), { ...data }, { merge: true }).then(
        () => refreshState()
      ));
  };
  const refreshState = () => {
    const promises = [
      setCupInfo((prev) => (prev = editCup.cupInfo) || {}),
      setPosterList([...editCup.cupInfo.cupPoster] || []),
      setCupOrg(editCup.cupInfo.cupOrg || ""),
      setCupDate(editCup.cupInfo.cupDate || { startDate: null }),
      setCupState(editCup.cupInfo.cupState || "대회준비중"),
    ];

    Promise.all(promises);
  };
  useMemo(() => getCup(), [params]);

  useMemo(() => {
    updateCup(editCup);
  }, [editCup]);

  const handlePosterTitle = (posters) => {
    if (posters !== undefined && posters.length) {
      const posterTitle = posters.filter((item) => item.title === true);
      console.log(posterTitle);
      if (posterTitle) {
        return { titleLink: posterTitle[0].link };
      } else {
        return { titleLink: null };
      }
    } else {
      return { titleLink: null };
    }
  };

  const handleRefereeTable = (data) => {
    let dataArray = [];
    if (data !== undefined && data.length) {
      data.map((item) => {
        const itemRow = [
          Decrypter(item.refName),
          Decrypter(item.refEmail),
          Decrypter(item.refTel),
        ];
        dataArray.push(itemRow);
      });
    }

    return dataArray;
  };

  return (
    <>
      {isLoading ? (
        <div className="flex w-full h-screen justify-center items-center align-middle">
          <Bars color="white" />
        </div>
      ) : (
        cupInfo && (
          <div className="flex w-full h-full flex-col gap-y-8">
            <Modal open={modal} onClose={handleCloseModal}>
              <div
                className="absolute top-1/2 left-1/2 border-0 px-10 py-3 outline-none rounded-lg flex flex-col"
                style={{
                  backgroundColor: "rgba(7,11,41,0.9)",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Modal창을 닫기 위해 제목을 부모창에서 열도록 설계했음 */}
                <div className="flex w-full">
                  <div className="flex w-1/2">
                    {widgetTitle({ title: "대회 정보 수정" })}
                  </div>
                  <div
                    className="flex w-1/2 justify-end items-center hover:cursor-pointer"
                    onClick={() => handleCloseModal()}
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-white text-2xl font-bold"
                    />
                  </div>
                </div>
                {modalComponent}
              </div>
            </Modal>
            <div className="flex w-full gap-x-8">
              <div
                className="flex w-1/3 justify-center p-5  rounded-lg"
                style={{ backgroundColor: "rgba(7,11,41,0.7" }}
              >
                <img
                  src={handlePosterTitle(posterList).titleLink || null}
                  className="w-full rounded-2xl object-cover object-top"
                />
              </div>
              <div
                className="flex w-2/3 flex-col px-10 py-8 gap-y-5 rounded-lg"
                style={{ backgroundColor: "rgba(7,11,41,0.7)" }}
              >
                <div className="flex justify-start items-top mb-5 gap-x-5">
                  <span className="text-white font-extrabold text-4xl">
                    {cupInfo && cupInfo.cupName} {cupInfo && cupInfo.cupCount}회
                  </span>
                  <div
                    className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl hover:cursor-pointer"
                    onClick={() =>
                      handleOpenModal({
                        component: <EditCupInfo />,
                      })
                    }
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="text-white text-lg"
                    />
                  </div>
                </div>

                <div className="flex justify-start items-top">
                  <span className="text-white text-xl">
                    대회명 : {cupInfo && cupInfo.cupName}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-xl">
                    회차 : {cupInfo && cupInfo.cupCount}회
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-xl">
                    주최 : {cupInfo && cupOrg}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-xl">
                    장소 : {cupInfo && cupInfo.cupLocation}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-xl">
                    일자 :{" "}
                    {cupDate.startDate === null ? "미정" : cupDate.startDate}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-xl">
                    상태 : {cupInfo && cupState}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full gap-x-8 ">
              <div className="flex w-1/2 h-96">
                <WidgetWithTable
                  data={{
                    title: "참가심판",
                    titleIcon: faScaleBalanced,
                    tableHeaders: REFEREE_HEADERS,
                    tableData: handleRefereeTable(editCup.refereeAssign),
                    modalComponent: <EditAssignReferees />,
                  }}
                />
              </div>
              <div className="flex w-1/2 h-96">
                <WidgetWithTable
                  data={{
                    title: "출전선수",
                    titleIcon: faPeopleLine,
                    tableHeaders: PLAYER_HEADERS,
                    tableData: "",
                    modalComponent: "",
                  }}
                />
              </div>
            </div>
            <div className="flex w-full h-96">
              <GameCategoryTable
                data={{
                  title: "개최종목",
                  titleIcon: faSitemap,
                  actionIcon: faPlus,
                }}
              />
            </div>
          </div>
        )
      )}
    </>
  );
};

export default CupView;
