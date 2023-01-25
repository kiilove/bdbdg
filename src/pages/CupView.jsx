import React from "react";
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
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Bars } from "react-loader-spinner";
import { NewCupInfo } from "../modals/NewCupInfo";
import { EditCupInfo } from "../modals/EditCupInfo";
const REFEREE_HEADERS = ["ID", "이름", "이메일"];
const PLAYER_HEADERS = ["ID", "이름", "이메일"];
const GAME_HEADERS = [
  "경기순서",
  "종목명",
  "필요 심판 / 배정된 심판",
  "필요 선수 / 배정된 선수",
  "체점표 준비",
  "준비율",
];

const tempGameData = [
  [
    "1",
    "171cm 남자클래식",
    "9 / 5",
    "10 / 4",
    "준비중",
    "50%",
    <FontAwesomeIcon icon={faPenToSquare} className="text-white text-lg" />,
  ],
  [
    "2",
    "181cm 남자클래식",
    "9 / 8",
    "10 / 8",
    "완료",
    "90%",
    <FontAwesomeIcon icon={faPenToSquare} className="text-white text-lg" />,
  ],
  [
    "3",
    "160cm 여자클래식",
    "9 / 5",
    "10 / 4",
    "준비중",
    "50%",
    <FontAwesomeIcon icon={faPenToSquare} className="text-white text-lg" />,
  ],
  [
    "4",
    "170cm 여자스포츠",
    "9 / 8",
    "10 / 8",
    "완료",
    "90%",
    <FontAwesomeIcon icon={faPenToSquare} className="text-white text-lg" />,
  ],
];

const CupView = () => {
  const params = useParams();
  const [cupId, setCupId] = useState();
  const [resData, setResData] = useState();
  const [cupInfo, setCupInfo] = useState({});
  const [posterList, setPosterList] = useState([]);
  const [posterTitle, setPosterTitle] = useState({
    id: 0,
    link: process.env.DEFAULT_POSTER,
    title: false,
  });
  const [cupData, setCupData] = useState();
  const [resReferee, setResReferee] = useState([]);
  const [resRefereeTableData, setResRefereeTableData] = useState([]);
  const [resPlayer, setResPlayer] = useState([]);
  const [resPlayerTableData, setResPlayerTableData] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = ({ component }) => {
    console.log(component);
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
  let dataObj;
  const getDocument = async () => {
    setIsLoading(true);
    try {
      const resDoc = await getDoc(doc(db, "cups", cupId));
      dataObj = { ...resDoc.data() };
    } catch (error) {
      console.log(error.message);
    } finally {
      setResData(dataObj);
      setCupInfo({ ...dataObj.cupInfo });

      setIsLoading(false);
      console.log(resData);
    }
  };

  useEffect(() => {
    getDocument();
  }, [cupId]);

  useEffect(() => {
    let title = [];
    if (cupInfo.cupPoster) {
      console.log("포스터 정리 진입");
      // const posterInfo = cupInfo.cupPoster.filter(
      //   (item) => item.title === true
      // );
      // setPosterTitle(posterInfo);
      // console.log(posterInfo);
      console.log(typeof cupInfo.cupPoster);
      const prevList = Array.prototype.slice.call(cupInfo.cupPoster);
      console.log("prevList: " + prevList);
      //setPosterList(prevList);
      if (prevList) {
        title = prevList.filter((item) => item.title === true);
        //setPosterTitle(title);
        //console.log(posterTitle);
        console.log(posterTitle);
        console.log(title[0]);
        setPosterTitle(title[0]);
      }
    }
  }, [cupInfo]);

  console.log("title", posterTitle);
  return (
    <>
      {isLoading ? (
        <div className="flex w-full h-screen justify-center items-center align-middle">
          <Bars color="white" />
        </div>
      ) : (
        resData && (
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
                  src={posterTitle && posterTitle.link}
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
                        component: (
                          <EditCupInfo
                            prevState={setCupInfo}
                            prevInfo={cupInfo}
                            id={cupId}
                            parentsModalState={setModal}
                          />
                        ),
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
                    주최 : {cupInfo && cupInfo.cupOrg}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-xl">
                    장소 : {cupInfo && cupInfo.cupLocation}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-xl">
                    일자 : {cupInfo && cupInfo.cupDate}
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
                    tableData: resRefereeTableData,
                    modalComponent: "",
                  }}
                />
              </div>
              <div className="flex w-1/2 h-96">
                <WidgetWithTable
                  data={{
                    title: "출전선수",
                    titleIcon: faPeopleLine,
                    tableHeaders: PLAYER_HEADERS,
                    tableData: resPlayerTableData,
                    modalComponent: "",
                  }}
                />
              </div>
            </div>
            <div className="flex w-full h-96">
              <WidgetWithTableDragable
                data={{
                  title: "개최종목",
                  titleIcon: faSitemap,
                  actionIcon: faPlus,
                  actionComponent: "",
                  tableHeaders: GAME_HEADERS,
                  tableData: tempGameData,
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
