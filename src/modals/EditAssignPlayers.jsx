import { where } from "firebase/firestore";
import React, { useContext, useEffect, useMemo } from "react";
import {
  faPenToSquare,
  faScaleBalanced,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "@mui/material";
import { useState } from "react";
import DragTable from "../components/DragTable";
import { BasicTable } from "../components/Tables";
import WidgetWithoutTable from "../components/WidgetWithoutTable";
import WidgetWithTable from "../components/WidgetWithTable";
import { EditcupContext } from "../context/EditcupContext";
import useFirestore from "../customhooks/useFirestore";
import useFirestoreSearch from "../customhooks/useFirestoreSearch";
import Loading from "../pages/Loading";
import EditInvoice from "./EditInvoice";
import { widgetTitle } from "../components/Titles";

const EditAssignPlayers = ({ cupId, gameId, gameTitle, gameClass }) => {
  console.log({ cupId, gameId, gameTitle, gameClass });
  const [isLoading, setIsLoading] = useState(true);
  const [getCupData, setGetCupData] = useState({});
  const [getJoinData, setGetJoinData] = useState([]);
  const [header, setHeader] = useState("header1");
  const [cupPlayers, setCupPlayers] = useState([]);
  const [joinPlayers, setJoinPlayers] = useState([]);
  const [cupOnlyPlayers, setCupOnlyPlayers] = useState([]);
  const [joinOnlyPlayers, setJoinOnlyPlayers] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalComponent, setModalComponent] = useState();
  const { editCup } = useContext(EditcupContext);

  const {
    data: cupData,
    error: cupError,
    getDocument: cupGetDocument,
  } = useFirestore();

  const { data: joinData, error: joinError } = useFirestoreSearch("cupsjoin", [
    where("cupId", "==", cupId),
  ]);

  const handleOpenModal = ({ component, title }) => {
    setModalComponent(() => component);
    setModalTitle((prev) => (prev = title));
    setModal(() => true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(() => false);
  };

  const DEAFULT_HEADER = ["순서", "이름", "이메일", "연락처"];
  const ACTION_HEADER = ["순서", "이름", "이메일", "연락처", "액션"];

  const compareCupAndJoin = (cup, join) => {
    function compareObjects(a, b) {
      // 객체의 고유 식별자를 비교하여 같으면 true, 다르면 false를 반환
      return a.pId === b.pId;
    }

    if (cup.length > 0 && join.length > 0) {
      const difference = cup.filter(
        (a) => !join.some((b) => compareObjects(a, b))
      );
      const onlyCup = cup.filter(
        (a) => !join.some((b) => compareObjects(a, b))
      );
      const onlyJoin = join.filter(
        (b) => !cup.some((a) => compareObjects(a, b))
      );

      return { onlyCup, onlyJoin };
    }
  };
  const playerTableData = (data, action) => {
    console.log(data.id);
    let dataArray = [];
    const joinButton = (joinId) => (
      <button
        className="flex w-full h-7 p-1 text-white bg-sky-500 rounded-lg justify-center items-center"
        onClick={() =>
          handleOpenModal({
            component: (
              <EditInvoice
                collectionId={joinId}
                cupFee={editCup.cupInfo.cupFee}
              />
            ),
            title: "참가신청서(신청서상 정보만 변경)",
          })
        }
      >
        조치
      </button>
    );
    if (!data.length) {
      return;
    }
    data.map((item, idx) => {
      let itemRow = [];
      !action
        ? (itemRow = [idx + 1, item.pName, item.pEmail, item.pTel])
        : (itemRow = [
            idx + 1,
            item.pName,
            item.pEmail,
            item.pTel,
            joinButton(item.id),
          ]);
      console.log(itemRow);
      dataArray.push(itemRow);
      itemRow = [];
    });

    return dataArray;
  };

  useMemo(() => {
    const compare = compareCupAndJoin(cupPlayers, joinPlayers);

    if (!compare) {
      return;
    }
    if (compare.onlyCup.length) {
      setCupOnlyPlayers([...compare.onlyCup]);
    }

    if (compare.onlyJoin.length) {
      setJoinOnlyPlayers([...compare.onlyJoin]);
    }
  }, [cupPlayers, joinPlayers]);

  useMemo(() => {
    if (getCupData.id) {
      const gameClassArray = getCupData.gamesCategory.find(
        (item) => item.id === gameId
      )?.class;

      const classPlayers = gameClassArray.find(
        (item) => item.title === gameClass
      )?.players;
      if (classPlayers) {
        setCupPlayers([...classPlayers]);
      }
    }

    if (getJoinData.length) {
      const joinPlayers = getJoinData.filter((item) => {
        return item.joinGames.some(
          (game) => game.id === gameId && game.gameClass === gameClass
        );
      });
      setJoinPlayers([...joinPlayers]);
    }

    if (getCupData.id && getJoinData.length) {
      setIsLoading(false);
    }
  }, [getCupData, getJoinData]);

  useEffect(() => {
    if (joinData.length) {
      setGetJoinData([...joinData]);
    }

    return () => {
      setGetJoinData([]);
    };
  }, [joinData]);

  useEffect(() => {
    setGetCupData({ ...cupData });
    return () => {
      setGetCupData({});
    };
  }, [cupData]);

  useEffect(() => {
    cupGetDocument("cups", cupId);
  }, []);

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border flex-col overflow-y-auto"
      style={{ minWidth: "800px", maxWidth: "800px", maxHeight: "800px" }}
    >
      {isLoading && <Loading />}
      {cupError && console.log("some error")}
      {!isLoading && (
        <>
          <Modal open={modal} onClose={handleCloseModal}>
            <div
              className="absolute top-1/2 left-1/2 border-0 px-10 py-3 outline-none rounded-lg flex flex-col"
              style={{
                backgroundColor: "rgba(7,11,41,0.9)",
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Modal창을 닫기 위해 제목을 부모창에서 열도록 설계했음 */}
              <div className="flex w-full ">
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
              <div className="flex w-full">{modalComponent}</div>
            </div>
          </Modal>
          <div className="flex w-full flex-col">
            <div className="flex w-full h-10">
              <span className="text-white text-sm">
                {gameTitle} / {gameClass}
              </span>
              <span className="text-white text-sm ml-2">선수명단</span>
            </div>
            <div className="flex w-full">
              <div className="flex w-full border-gray-400 rounded-xl bg-slate-800 p-1">
                <div className="relative flex w-1/3 h-16 justify-center items-center p-2 transition-all duration-500">
                  <label htmlFor="header1">
                    <input
                      type="radio"
                      id="header1"
                      name="header"
                      className="hidden"
                      onClick={(e) => setHeader(e.target.id)}
                    />
                    <div
                      className={`h-full w-full absolute inset-0 ${
                        header === "header1" ? "bg-white" : ""
                      } rounded-xl justify-center items-center flex hover:cursor-pointer flex-col`}
                    >
                      <span
                        className={`text-white font-semibold ${
                          header === "header1" ? "text-black" : ""
                        }`}
                      >
                        확정선수 명단
                      </span>
                      <span
                        className={`text-white text-sm ${
                          header === "header1" ? "text-black" : ""
                        }`}
                      >
                        출전 순서 드래그로 조정가능합니다.
                      </span>
                    </div>
                  </label>
                </div>
                <div className="relative flex w-1/3 h-16 justify-center items-center p-2 transition-all duration-500">
                  <label htmlFor="header2">
                    <input
                      type="radio"
                      id="header2"
                      name="header"
                      className="hidden"
                      onClick={(e) => setHeader(e.target.id)}
                    />
                    <div
                      className={`h-full w-full absolute inset-0 ${
                        header === "header2" ? "bg-white" : ""
                      } rounded-xl justify-center items-center flex hover:cursor-pointer flex-col`}
                    >
                      <span
                        className={`text-white font-semibold ${
                          header === "header2" ? "text-black" : ""
                        }`}
                      >
                        신청선수 명단
                      </span>
                      <span
                        className={`text-white text-sm ${
                          header === "header2" ? "text-black" : ""
                        }`}
                      >
                        신청서가 접수된 전체 명단입니다.
                      </span>
                    </div>
                  </label>
                </div>
                <div className="relative flex w-1/3 h-16 justify-center items-center p-2 transition-all duration-500">
                  <label htmlFor="header3">
                    <input
                      type="radio"
                      id="header3"
                      name="header"
                      className="hidden"
                      onClick={(e) => setHeader(e.target.id)}
                    />
                    <div
                      className={`h-full w-full absolute inset-0 flex-col ${
                        header === "header3" ? "bg-white" : ""
                      } rounded-xl justify-center items-center flex hover:cursor-pointer`}
                    >
                      <span
                        className={`text-white font-semibold ${
                          header === "header3" ? "text-black" : ""
                        }`}
                      >
                        대기 선수 명단
                      </span>
                      <span
                        className={`text-white text-sm ${
                          header === "header3" ? "text-black" : ""
                        }`}
                      >
                        출전확정이 필요한 명단
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div
            className="flex w-full h-full p-2 justify-center items-start"
            style={{ minHeight: "500px" }}
          >
            {header === "header1" && (
              <WidgetWithoutTable
                data={{
                  tableHeaders: DEAFULT_HEADER,
                  tableData: playerTableData(cupPlayers),
                }}
                mystyle={{ height: "h-full" }}
              />
            )}
            {header === "header2" && (
              <WidgetWithoutTable
                data={{
                  tableHeaders: DEAFULT_HEADER,
                  tableData: playerTableData(joinPlayers),
                }}
                mystyle={{ height: "h-full" }}
              />
            )}
            {header === "header3" && (
              <div className="flex flex-col w-full">
                {cupOnlyPlayers.length && (
                  <div className="flex w-full h-full flex-col">
                    <span className="text-white">참가신청서가 없는 선수</span>

                    <WidgetWithoutTable
                      data={{
                        tableHeaders: ACTION_HEADER,
                        tableData: playerTableData(cupOnlyPlayers, true),
                      }}
                      mystyle={{ height: "h-full" }}
                    />
                  </div>
                )}
                {joinOnlyPlayers.length && (
                  <div className="flex w-full h-full flex-col">
                    <span className="text-white">출전명단에 없는 선수</span>
                    <WidgetWithoutTable
                      data={{
                        tableHeaders: ACTION_HEADER,
                        tableData: playerTableData(joinOnlyPlayers, true),
                      }}
                      mystyle={{ height: "h-full" }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EditAssignPlayers;
