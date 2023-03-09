import { faLock, faLockOpen, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { widgetTitle } from "../components/Titles";
import { addComma, removeComma } from "../customhooks/fomatFn";

import useFirestore from "../customhooks/useFirestore";
import { EditAssignGameCategory } from "./EditAssignGamesCategory";
const inputBoxStyle =
  "flex w-full rounded-xl border border-gray-500 h-10 mb-1 items-center px-4";
const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white focus:ring-0";

const EditInvoice = (props) => {
  const [isLock, setIsLock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [joinInfo, setJoinInfo] = useState({});
  const [newCupData, setNewCupData] = useState({});
  const [joinGames, setJoinGames] = useState([]);
  const [feeInfo, setFeeInfo] = useState({});
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalComponent, setModalComponent] = useState();
  const { data, loading, error, getDocument, updateData } = useFirestore();
  const {
    data: cupData,
    error: cupError,
    getDocument: cupGetDocument,
  } = useFirestore();
  const [joinFee, setJoinFee] = useState(0);
  const [incomeFee, setIncomeFee] = useState(0);

  const handleFee = () => {
    let sumFee = 0;
    let extraCount = 0;
    const basicFee = props.cupFee.basicFee;
    const extraFee = props.cupFee.extraFee;
    const extraType = props.cupFee.extraType;
    const gameCount = joinGames.length;
    console.log(extraFee);
    if (gameCount <= 1) {
      extraCount = 0;
    } else {
      extraCount = gameCount - 1;
    }

    switch (extraType) {
      case "정액":
        console.log("정액");
        if (extraCount > 0) {
          sumFee = basicFee + extraFee;
        } else {
          sumFee = basicFee;
        }
        break;
      case "누적":
        console.log(extraCount);
        if (extraCount > 0) {
          sumFee = basicFee + extraFee * extraCount;
        } else {
          sumFee = basicFee;
        }
        break;
      case "없음":
        sumFee = basicFee;

      default:
        break;
    }
    console.log(sumFee);
    setJoinFee(sumFee);
    setFeeInfo({ ...feeInfo, joinFee: sumFee });
  };

  const handleOpenModal = ({ component, title }) => {
    setModalComponent(() => component);
    setModalTitle((prev) => (prev = title));
    setModal(() => true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(() => false);
  };

  const handleInputs = (e) => {
    if (e.target.name !== "cupPoster") {
      setJoinInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };
  const handleComma = (e) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, ""));
    setIncomeFee(value);
  };

  const handleFeeInfo = () => {
    console.log(feeInfo);
    setFeeInfo({ ...feeInfo, joinFee, incomeFee });
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleConfirm = async (value) => {
    if (!newCupData.id) {
      alert("잠시후 다시 시도해주세요!");
      return;
    }

    await handleAddPlayerByGamesCategory();
    await updateData("cups", newCupData.id, newCupData);
    await updateData("cupsjoin", joinInfo.id, {
      ...joinInfo,
      isConfirmed: value,
      feeInfo,
    });
    setIsLock(value);
    setIsConfirmed(value);
  };

  const handleAddPlayerByGamesCategory = async () => {
    const updatedGamesCategory = cupData.gamesCategory.map((category) => {
      const game = joinGames.find((game) => game.id === category.id);
      if (!game) return category;
      const classArray = category.class.map((classItem) => {
        const existingPlayers = classItem.players || [];
        const filteredPlayers = existingPlayers.filter(
          (player) => player.pId !== joinInfo.pId
        );
        return {
          ...classItem,
          players: filteredPlayers,
        };
      });
      const titleObject = classArray.findIndex(
        (item) => item.title === game.gameClass
      );
      if (titleObject === -1) return category;
      const newPlayers = [
        ...(classArray[titleObject]?.players || []),
        {
          pName: joinInfo.pName,
          pId: joinInfo.pId,
          pEmail: joinInfo.pEmail,
          pTel: joinInfo.pTel,
        },
      ];
      classArray[titleObject] = {
        ...(classArray[titleObject] || {}),
        players: newPlayers,
      };
      return { ...category, class: classArray };
    });
    setNewCupData({ ...cupData, gamesCategory: updatedGamesCategory });
  };

  const removePlayerByPid = (pid) => {
    const updatedGamesCategory = cupData.gamesCategory.map((category) => {
      const classArray = [...category.class];
      classArray.forEach((item) => {
        item.players = item.players.filter((player) => player.pId !== pid);
      });
      return { ...category, class: classArray };
    });
    setNewCupData({ ...cupData, gamesCategory: updatedGamesCategory });
  };

  useEffect(() => {
    getDocument("cupsjoin", props.collectionId);
  }, [props.collectionId]);

  useEffect(() => {
    // console.log(data);
    data.joinGames && setJoinGames([...data.joinGames]);
    data.docuId && setJoinInfo({ ...data });
    data.docuId && setFeeInfo({ ...data.feeInfo });
  }, [data]);

  useMemo(() => {
    if (props.cupFee && joinGames) {
      handleFee();
    }
    setJoinInfo((prev) => ({ ...prev, joinGames }));
  }, [joinGames]);

  useMemo(() => {
    setFeeInfo(joinInfo.feeInfo);
    setIsConfirmed(joinInfo.isConfirmed);
    if (joinInfo.docuId) {
      cupGetDocument("cups", data.cupId);
      setIncomeFee(joinInfo.feeInfo.incomeFee);

      //setJoinFee(joinInfo.feeInfo.joinFee);
      setIsLoading(false);
    }
  }, [joinInfo]);

  useMemo(() => {
    console.log(cupData);
    if (cupData.id) {
      handleAddPlayerByGamesCategory();
    }
  }, [cupData]);

  useMemo(
    () => setFeeInfo({ ...feeInfo, joinFee, incomeFee }),
    [joinFee, incomeFee]
  );

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border flex-col "
      style={{ minWidth: "1000px", maxWidth: "1200px" }}
    >
      {isLoading && <div>로딩중</div>}
      {error && console.log(error.code)}
      {!isLoading && (
        <>
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
          <div className="flex w-full  flex-col items-start gap-y-2 mb-5">
            <div className="flex w-full h-16 justify-between items-center gap-x-3">
              <div className="flex">
                {joinFee === incomeFee && (
                  <div className="flex justify-center items-center w-36 h-10 bg-sky-500 rounded-lg text-white font-semibold">
                    입금확인됨
                  </div>
                )}
                {joinFee < incomeFee && (
                  <div className="flex justify-center items-center w-36 h-10 bg-yellow-500 rounded-lg text-white font-semibold">
                    과입금
                  </div>
                )}
                {joinFee > incomeFee && (
                  <div className="flex justify-center items-center w-36 h-10 bg-red-500 rounded-lg text-white font-semibold">
                    입금필요
                  </div>
                )}
              </div>
              <div className="flex gap-x-3">
                {isConfirmed ? (
                  <button
                    className="w-32 h-10 bg-red-500 rounded-lg text-white"
                    onClick={() => handleConfirm(false)}
                  >
                    <span className="mr-2">확정취소</span>
                    <FontAwesomeIcon icon={faLock} />
                  </button>
                ) : (
                  <button
                    className="w-32 h-10 bg-sky-500 rounded-lg text-white"
                    onClick={() => handleConfirm(true)}
                  >
                    <span className="mr-2">출전확정</span>
                    <FontAwesomeIcon icon={faLockOpen} />
                  </button>
                )}
              </div>
            </div>
            <div className={inputBoxStyle}>
              <div className="flex text-white text-sm w-28">일련번호</div>
              <div className="flex text-white text-sm ml-5">{data.docuId}</div>
            </div>
            <div className={inputBoxStyle}>
              <div className="flex text-white text-sm w-28">선수이름</div>
              <div className="flex text-white ml-2">
                <input
                  type="text"
                  name="pName"
                  id="pName"
                  disabled={isLock}
                  value={data.pName}
                  onChange={(e) => handleInputs(e)}
                  className={inputTextStyle}
                />
              </div>
            </div>
            <div className={inputBoxStyle}>
              <div className="flex text-white text-sm w-28">선수이메일</div>
              <div className="flex text-white ml-2">
                <input
                  type="text"
                  name="pEmail"
                  id="pEmail"
                  disabled={isLock}
                  value={data.pEmail || ""}
                  onChange={(e) => handleInputs(e)}
                  className={inputTextStyle}
                />
              </div>
            </div>
            <div className={inputBoxStyle}>
              <div className="flex text-white text-sm w-28">선수전화번호</div>
              <div className="flex text-white ml-2">
                <input
                  type="text"
                  name="pTel"
                  id="pTel"
                  disabled={isLock}
                  value={data.pTel}
                  onChange={(e) => handleInputs(e)}
                  className={inputTextStyle}
                />
              </div>
            </div>
            <div className={inputBoxStyle}>
              <div className="flex text-white text-sm w-28">생년월일</div>
              <div className="flex text-white ml-2">
                <input
                  type="text"
                  name="pBirth"
                  id="pBirth"
                  disabled={isLock}
                  value={data.pBirth}
                  onChange={(e) => handleInputs(e)}
                  className={inputTextStyle}
                />
              </div>
            </div>
            <div className={inputBoxStyle}>
              <div className="flex text-white text-sm w-28">성별</div>
              <div className="flex ml-2 text-white">
                {isLock ? (
                  <span className="ml-3 text-sm">
                    {data.pGender === "m" ? "남자" : "여자"}
                  </span>
                ) : (
                  <div className="ml-3 flex gap-x-5">
                    <label htmlFor="pGenderM">
                      <input
                        type="radio"
                        name="pGender"
                        id="pGenderM"
                        checked={data.pGender === "m"}
                        value="m"
                        onClick={(e) => handleInputs(e)}
                      />
                      <span className="text-white ml-2 text-sm">남자</span>
                    </label>
                    <label htmlFor="pGenderM">
                      <input
                        type="radio"
                        name="pGender"
                        id="pGenderM"
                        checked={data.pGender === "f"}
                        value="f"
                        onClick={(e) => handleInputs(e)}
                      />
                      <span className="text-white ml-2 text-sm">여자</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className={inputBoxStyle}>
              <div className="flex text-white text-sm w-28">접수일자</div>
              <div className="flex text-white ml-2">
                <input
                  type="text"
                  name="invoiceDate"
                  id="invoiceDate"
                  disabled={isLock}
                  value={data.invoiceDate}
                  onChange={(e) => handleInputs(e)}
                  className={inputTextStyle}
                />
              </div>
            </div>
            <div className={inputBoxStyle}>
              <div className="flex text-white text-sm w-28">
                참가료(책정금액)
              </div>
              <div className="flex text-white ml-2">
                <input
                  type="text"
                  name="joinFee"
                  id="joinFee"
                  disabled={isLock}
                  value={Number(joinFee).toLocaleString() || 0}
                  className={inputTextStyle}
                />
              </div>
            </div>
            <div className={inputBoxStyle}>
              <div className="flex text-white text-sm w-28">입금금액</div>
              <div className="flex text-white ml-2">
                <input
                  type="text"
                  name="incomeFee"
                  id="incomeFee"
                  disabled={isLock}
                  value={numberWithCommas(incomeFee)}
                  onChange={(e) => {
                    //e.preventDefault();
                    handleComma(e);
                  }}
                  className={inputTextStyle}
                />
              </div>
              {!isLock && (
                <div className="flex w-1/2 justify-start items-center gap-x-2">
                  <button
                    className="bg-blue-500 text-white w-14 py-1 px-2 rounded-lg text-xs"
                    onClick={() => setIncomeFee(joinFee)}
                  >
                    정액
                  </button>
                  <button
                    className="bg-blue-500 text-white w-24 py-1 px-2 rounded-lg text-xs"
                    onClick={() => handleFeeInfo()}
                  >
                    입금확인
                  </button>
                </div>
              )}
            </div>
            <div className={`${inputBoxStyle} h-auto gap-5 py-1`}>
              <div className="flex text-white text-sm w-28">신청종목</div>
              <div className="flex text-white gap-2 flex-wrap justify-start items-center">
                {joinGames &&
                  joinGames.map((game) => (
                    <div className="flex flex-wrap h-full p-1">
                      <span className="bg-blue-500 py-1 px-2 text-xs rounded-lg">
                        {game.gameTitle} ({game.gameClass})
                      </span>
                    </div>
                  ))}
              </div>
              {!isLock && (
                <div className="flex text-white ml-2 gap-2 flex-wrap justify-start items-center">
                  <div className="flex flex-wrap h-full p-1">
                    <button
                      onClick={() => {
                        handleOpenModal({
                          component: (
                            <EditAssignGameCategory
                              data={data}
                              prevSetState={setJoinGames}
                            />
                          ),
                          title: "신청종목 편집",
                        });
                      }}
                    >
                      <span className="bg-blue-500 py-1 px-2 text-xs rounded-lg">
                        신청종목 변경
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditInvoice;
