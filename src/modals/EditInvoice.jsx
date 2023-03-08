import { faLock, faLockOpen, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { widgetTitle } from "../components/Titles";

import useFirestore from "../customhooks/useFirestore";
import { EditAssignGameCategory } from "./EditAssignGamesCategory";
const inputBoxStyle =
  "flex w-full rounded-xl border border-gray-500 h-10 mb-1 items-center px-4";
const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white focus:ring-0";

const EditInvoice = (props) => {
  const [isLock, setIsLock] = useState(true);
  const [joinInfo, setJoinInfo] = useState({});
  const [joinGames, setJoinGames] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalComponent, setModalComponent] = useState();
  const { data, loading, error, getDocument } = useFirestore();

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

  const handleIncomeMoney = () => {
    const isIncome = !joinInfo.incomeMoney || false;
    setJoinInfo((prev) => ({ ...prev, incomeMoney: isIncome }));
  };

  useEffect(() => {
    getDocument("cupsjoin", props.collectionId);
  }, [props.collectionId]);

  useEffect(() => {
    // console.log(data);
    data.joinGames && setJoinGames([...data.joinGames]);
    setJoinInfo({ ...data });
  }, [data]);

  useMemo(
    () => setJoinInfo((prev) => ({ ...prev, joinGames: [...joinGames] })),
    [joinGames]
  );

  useMemo(() => console.log(joinInfo), [joinInfo]);

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border flex-col "
      style={{ minWidth: "1000px", maxWidth: "1200px" }}
    >
      {loading && <div>로딩중</div>}
      {error && <div>페이지 오류</div>}
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
      <div className="flex w-full  flex-col items-start gap-y-2">
        <div className="flex w-full h-16 justify-end items-center gap-x-3">
          <div className="flex">
            {joinInfo.incomeMoney ? (
              <button
                className="w-36 h-10 bg-orange-500 rounded-lg text-white font-semibold"
                onClick={() => {
                  handleIncomeMoney();
                }}
              >
                입금확인됨
              </button>
            ) : (
              <button
                className="w-36 h-10 bg-sky-500 rounded-lg text-white font-semibold"
                onClick={() => {
                  handleIncomeMoney();
                }}
              >
                참가료 입금필요
              </button>
            )}
          </div>
          <div className="flex">
            <button
              className="w-10 h-10 bg-sky-500 rounded-lg text-white"
              onClick={() => {
                setIsLock(!isLock);
              }}
            >
              {isLock ? (
                <FontAwesomeIcon icon={faLock} />
              ) : (
                <FontAwesomeIcon icon={faLockOpen} />
              )}
            </button>
          </div>
        </div>
        <div className={inputBoxStyle}>
          <div className="flex text-white text-sm w-24">일련번호</div>
          <div className="flex text-white text-sm ml-5">{data.docuId}</div>
        </div>
        <div className={inputBoxStyle}>
          <div className="flex text-white text-sm w-24">선수이름</div>
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
          <div className="flex text-white text-sm w-24">선수이메일</div>
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
          <div className="flex text-white text-sm w-24">선수전화번호</div>
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
          <div className="flex text-white text-sm w-24">생년월일</div>
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
          <div className="flex text-white text-sm w-24">성별</div>
          <div className="flex ml-2 text-white">
            {isLock ? (
              <span className="ml-3">
                {data.pGender === "m" ? "남자" : "여자"}
              </span>
            ) : (
              <div className="ml-3">
                <label htmlFor="pGenderM">
                  <input
                    type="radio"
                    name="pGender"
                    id="pGenderM"
                    checked={data.pGender === "m"}
                    value="m"
                    onClick={(e) => handleInputs(e)}
                  />
                  <span className="text-white ml-2">남자</span>
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
                  <span className="text-white ml-2">여자</span>
                </label>
              </div>
            )}
          </div>
        </div>
        <div className={inputBoxStyle}>
          <div className="flex text-white text-sm w-24">접수일자</div>
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
          <div className="flex text-white text-sm w-24">참가료</div>
          <div className="flex text-white ml-2">
            <input
              type="text"
              name="invoiceDate"
              id="invoiceDate"
              disabled={isLock}
              value={data.incomeMoney.price || 0}
              onChange={(e) => handleInputs(e)}
              className={inputTextStyle}
            />
          </div>
        </div>
        <div className={`${inputBoxStyle} h-auto gap-5 py-1`}>
          <div className="flex text-white text-sm w-24">신청종목</div>
          <div className="flex text-white ml-2 gap-2 w-full flex-wrap justify-start items-center">
            {isLock ? (
              joinGames &&
              joinGames.map((game) => (
                <div className="flex flex-wrap h-full p-1">
                  <span className="bg-blue-500 py-1 px-2 text-xs rounded-lg">
                    {game.gameTitle} ({game.gameClass})
                  </span>
                </div>
              ))
            ) : (
              <div className="flex text-white py-1 ml-2 gap-2 w-full flex-wrap justify-start items-center">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoice;
