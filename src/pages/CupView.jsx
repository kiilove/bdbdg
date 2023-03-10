import React, { useCallback, useContext, useMemo, useReducer } from "react";
import { Modal } from "@mui/material";
import { widgetTitle } from "../components/Titles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFlagCheckered,
  faPenToSquare,
  faPeopleLine,
  faPlus,
  faScaleBalanced,
  faSitemap,
  faSquarePen,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import WidgetWithTable from "../components/WidgetWithTable";
import { useState } from "react";
import { useEffect } from "react";
import WidgetWithTableDragable from "../components/WidgetWithTableDragable";

import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Bars } from "react-loader-spinner";
import { NewCupInfo } from "../modals/NewCupInfo";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { EditCupInfo } from "../modals/EditCupInfo";
import { EditcupContext } from "../context/EditcupContext";
import { Decrypter } from "../components/Encrypto";
import GameCategoryTable from "../components/GameCategoryTable";
import EditAssignReferees from "../modals/EditAssignReferees";
import dayjs from "dayjs";
import EditInvoice from "../modals/EditInvoice";
import PlayerOrderTable from "../components/PlayerOrderTable";
const REFEREE_HEADERS = ["이름", "이메일", "연락처"];
const PLAYER_HEADERS = ["이름", "연락처", "참가신청서"];
const INVOICE_HEADERS = [
  "이름",
  "이메일",
  "연락처",
  "신청일자",
  "신청종목",
  "액션",
];

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
  const [posterTitle, setPosterTitle] = useState();
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalComponent, setModalComponent] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [invoiceList, setInvoiceList] = useState([]);
  const { dispatch, editCup } = useContext(EditcupContext);

  const handleOpenModal = ({ component, title }) => {
    setModalComponent(() => component);
    setModalTitle((prev) => (prev = title));
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
        return data.data();
      })
      .then((data) => {
        const titleLink = handlePosterTitle(data.cupInfo.cupPoster);
        if (titleLink === undefined || titleLink === null) {
          setPosterTitle("");
        } else {
          setPosterTitle(titleLink.titleLink);
        }
      })
      .then(() => setIsLoading(false))
      .catch((error) => console.log(error));
  };

  const getPlayerInvoice = async () => {
    let dummy = [];
    const invoiceRef = collection(db, "cupsjoin");
    const invoiceQ = query(invoiceRef, where("cupId", "==", cupId));
    const invoiceSnapshot = await getDocs(invoiceQ);

    await invoiceSnapshot.forEach((doc) => {
      dummy.push({ id: doc.id, ...doc.data() });
    });

    return new Promise((resolve, reject) => {
      resolve(setInvoiceList([...dummy]));
    });
  };

  const confirmedPlayerInvoice = (data) => {
    const result = data.filter((invoice) => invoice.isConfirmed === true);

    console.log(result);
    return result;
  };

  const checkListPlayerInvoice = (data) => {
    const result = data.filter((invoice) => invoice.isConfirmed !== true);

    console.log(result);
    return result;
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
  useMemo(() => {
    getCup();
    getPlayerInvoice();
  }, [params]);

  useMemo(() => {
    updateCup(editCup);
  }, [editCup]);

  const handlePosterTitle = (posters) => {
    if (posters !== undefined && posters.length) {
      const posterTitle = posters.filter((item) => item.title === true);

      if (posterTitle === undefined || posterTitle.length === 0) {
        return { titleLink: null };
      } else {
        return { titleLink: posterTitle[0].link };
      }
    } else {
      return { titleLink: null };
    }
  };

  const handleInvoicePlayers = (data) => {
    let dataArray = [];
    console.log(data);

    if (data !== undefined && data.length) {
      data.map((item) => {
        const itemRow = [
          item.pName,
          item.pEmail,
          item.pTel,
          dayjs(item.invoiceDate).format("YYYY-MM-DD"),
          item.joinGames.map((game) => (
            <div className="flex flex-wrap w-full gap-2 h-full p-1">
              <span className="bg-blue-500 py-1 px-2 text-xs rounded-lg">
                {game.gameTitle} ({game.gameClass})
              </span>
            </div>
          )),
          <div className="flex">
            <div className="flex">
              <button
                onClick={() =>
                  handleOpenModal({
                    component: (
                      <EditInvoice
                        collectionId={item.id}
                        cupFee={editCup.cupInfo.cupFee}
                      />
                    ),
                    title: "참가신청서(신청서상 정보만 변경)",
                  })
                }
              >
                <span className="bg-blue-500 py-1 px-2 text-xs rounded-lg">
                  참가신청서
                </span>
              </button>
            </div>
            <div className="flex"></div>
          </div>,
        ];
        dataArray.push(itemRow);
      });
    }
    console.log(dataArray);
    return dataArray;
  };

  const handleConfirmedPlayers = (data) => {
    let dataArray = [];
    console.log(data);

    if (data !== undefined && data.length) {
      data.map((item) => {
        const itemRow = [
          item.pName,
          item.pTel,
          item.joinGames.length || 0,
          <div className="flex">
            <div className="flex">
              <button
                onClick={() =>
                  handleOpenModal({
                    component: (
                      <EditInvoice
                        collectionId={item.id}
                        cupFee={editCup.cupInfo.cupFee}
                      />
                    ),
                    title: "참가신청서(신청서상 정보만 변경)",
                  })
                }
              >
                <span className="bg-blue-500 py-1 px-2 text-xs rounded-lg">
                  참가신청서
                </span>
              </button>
            </div>
          </div>,
        ];
        dataArray.push(itemRow);
      });
    }
    console.log(dataArray);
    return dataArray;
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
          <div className="flex w-full h-full flex-col gap-y-5">
            <Modal open={modal} onClose={handleCloseModal}>
              <div
                className="absolute top-1/2 left-1/2 border-0 px-10 py-3 outline-none rounded-lg flex flex-col"
                style={{
                  backgroundColor: "rgba(7,11,41,1)",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Modal창을 닫기 위해 제목을 부모창에서 열도록 설계했음 */}
                <div className="flex w-full">
                  <div className="flex w-1/2">
                    {widgetTitle({ title: modalTitle })}
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
            <div className="flex w-full gap-x-5">
              <div
                className="flex justify-center p-3  rounded-lg"
                style={{ backgroundColor: "rgba(7,11,41,0.7" }}
              >
                <img
                  src={posterTitle}
                  className=" w-80 rounded-2xl object-cover object-top"
                />
              </div>
              <div
                className="flex w-full flex-col p-3 gap-y-5 rounded-lg"
                style={{ backgroundColor: "rgba(7,11,41,0.7)" }}
              >
                <div className="flex">
                  <div className="flex items-center justify-start bg-slate-800 w-full h-14 rounded-xl px-5 gap-x-2">
                    <div className="flex justify-between w-full">
                      <div className="flex justify-center items-center">
                        <FontAwesomeIcon
                          icon={faFlagCheckered}
                          className="text-white text-base mr-2"
                        />
                        <span className="text-white text-base ">
                          기초정보(모집공고)
                        </span>
                      </div>
                      <div
                        className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl hover:cursor-pointer"
                        onClick={() =>
                          handleOpenModal({
                            component: <EditCupInfo />,
                            title: "대회정보수정",
                          })
                        }
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="text-white text-lg hover:cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full h-full px-5 gap-y-2">
                  <div className="flex justify-start items-top ">
                    <span className="text-white text-base">
                      대회명 : {cupInfo && cupInfo.cupName}
                    </span>
                  </div>
                  <div className="flex justify-start items-top">
                    <span className="text-white text-base">
                      회차 : {cupInfo && cupInfo.cupCount}회
                    </span>
                  </div>
                  <div className="flex justify-start items-top">
                    <span className="text-white text-base">
                      주최 : {cupInfo && cupOrg}
                    </span>
                  </div>
                  <div className="flex justify-start items-top">
                    <span className="text-white text-base">
                      장소 : {cupInfo && cupInfo.cupLocation}
                    </span>
                  </div>
                  <div className="flex justify-start items-top">
                    <span className="text-white text-base">
                      일자 :{" "}
                      {cupDate.startDate === null
                        ? "미정"
                        : dayjs(cupDate.startDate).format("YYYY-MM-DD")}
                    </span>
                  </div>
                  <div className="flex justify-start items-top">
                    <span className="text-white text-base">
                      상태 : {cupInfo && cupState}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full gap-x-8 ">
              <div className="flex w-full h-96">
                <WidgetWithTable
                  data={{
                    title: "참가신청선수명단(확인필요)",
                    titleIcon: faPeopleLine,
                    tableHeaders: INVOICE_HEADERS,
                    tableData: handleInvoicePlayers(
                      checkListPlayerInvoice(invoiceList)
                    ),
                  }}
                />
              </div>
            </div>
            <div className="flex w-full gap-x-8 ">
              <div className="flex w-1/2 h-96">
                <WidgetWithTable
                  data={{
                    title: "대회참가 심판",
                    titleIcon: faScaleBalanced,
                    tableHeaders: REFEREE_HEADERS,
                    tableData: handleRefereeTable(editCup.refereeAssign),
                    modalComponent: <EditAssignReferees />,
                    modalTitle: "심판배정",
                    editIcon: true,
                  }}
                />
              </div>
              <div className="flex w-1/2 h-96">
                <WidgetWithTable
                  data={{
                    title: "출전명단",
                    titleIcon: faPeopleLine,
                    tableHeaders: PLAYER_HEADERS,
                    tableData: handleConfirmedPlayers(
                      confirmedPlayerInvoice(invoiceList)
                    ),
                    modalComponent: "",
                  }}
                />
              </div>
            </div>
            <div className="flex w-full h-full">
              <GameCategoryTable
                data={{
                  title: "개최종목 (종목 드래그로 순서변경가능)",
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
