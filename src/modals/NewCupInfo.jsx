import { useContext, useEffect, useMemo, useRef } from "react";
import { db } from "../firebase";

import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { formTitle, widgetTitle } from "../components/Titles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Modal } from "@mui/material";

import ImageForm from "../components/ImageForm";
import { NewcupContext } from "../context/NewcupContext";

const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-1";

const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white focus:ring-0";

export const NewCupInfo = () => {
  const [cupInfo, setCupInfo] = useState({});
  const [orgList, setOrgList] = useState([]);
  const [fee, setFee] = useState({
    basicFee: 0,
    extraFee: 0,
    extraType: "없음",
  });

  const [cupOrg, setCupOrg] = useState("");
  const [cupState, setCupState] = useState("신청접수중");
  const [cupDate, setCupDate] = useState({});
  const [posterList, setPosterList] = useState([...(cupInfo.cupPoster || [])]);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState();

  const { dispatch, newCup } = useContext(NewcupContext);

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(() => false);
  };

  const handleCupInfo = (e) => {
    if (e.target.name !== "cupPoster") {
      setCupInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const getOrgCollection = async () => {
    let dataArray = [];
    try {
      const orgRef = collection(db, "orgs");
      const orgQ = query(orgRef, orderBy("createAt"));
      const querySnapshot = await getDocs(orgQ);
      querySnapshot.forEach((doc) => {
        dataArray.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.log(error);
    }

    return new Promise((resolve, reject) => {
      resolve(setOrgList(dataArray));
    });
  };

  useMemo(
    () =>
      dispatch({
        type: "KEEP",
        payload: {
          cupData: {
            ...newCup,
            cupInfo: { ...cupInfo },
          },
        },
      }),

    [cupInfo]
  );

  useMemo(() => getOrgCollection(), []);
  useMemo(() => {
    setCupInfo((prev) => (prev = newCup.cupInfo) || {});
    setPosterList([...newCup.cupInfo.cupPoster] || []);
    setCupOrg(newCup.cupInfo.cupOrg || "");
    setCupDate(newCup.cupInfo.cupDate || { startDate: new Date() });
    setCupState(newCup.cupInfo.cupState || "신청접수중");
  }, []);

  useMemo(
    () =>
      setCupInfo((prev) => ({
        ...prev,
        cupOrg: cupOrg,
        cupPoster: posterList,
        cupDate: cupDate,
        cupState: cupState,
        cupFee: fee,
      })),
    [cupOrg, posterList, cupDate, cupState, fee]
  );

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border"
      style={{ minWidth: "800px", maxWidth: "1000px" }}
    >
      <Modal open={modal} onClose={handleCloseModal}>
        <div
          className="absolute top-1/2 left-1/2 border-0 px-10 py-3 outline-none rounded-md flex flex-col"
          style={{
            backgroundColor: "rgba(7,11,41,0.9)",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Modal창을 닫기 위해 제목을 부모창에서 열도록 설계했음 */}
          <div className="flex w-full">
            <div className="flex w-1/2">
              {widgetTitle({ title: "포스터 선택" })}
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
      <div className="flex w-1/3 flex-col">
        <div className="flex justify-center items-start mt-3">
          {/* 이미지 업로드 폼 시작 */}
          <ImageForm
            prevImageList={posterList}
            prevSetImageList={setPosterList}
            header="P"
            uploadFolder="images/poster/"
          />
          {/* 이미지 업로드 폼 끝 */}
        </div>
      </div>
      <div className="flex w-2/3 h-full flex-col flex-wrap box-border">
        <div className="flex w-full">{formTitle({ title: "대회상태" })}</div>
        <div className="flex w-full gap-x-5">
          <label className="flex w-1/4 justify-center items-center">
            <input
              type="radio"
              name="cupState"
              id="cupState1"
              value="신청접수중"
              checked={cupState === "신청접수중"}
              onChange={(e) => setCupState((prev) => (prev = e.target.value))}
            />
            <span className="flex justify-start items-center text-white text-sm ml-3">
              신청접수중
            </span>
          </label>
          <label className="flex w-1/4 justify-center items-center">
            <input
              type="radio"
              name="cupState"
              id="cupState2"
              value="대회중"
              checked={cupState === "대회중"}
              onChange={(e) => setCupState((prev) => (prev = e.target.value))}
            />
            <span className="flex justify-start items-center text-white text-sm ml-3">
              대회중
            </span>
          </label>
          <label className="flex w-1/4 justify-center items-center">
            <input
              type="radio"
              name="cupState"
              id="cupState3"
              value="대회종료"
              checked={cupState === "대회종료"}
              onChange={(e) => setCupState((prev) => (prev = e.target.value))}
            />
            <span className="flex justify-start items-center text-white text-sm ml-3">
              대회종료
            </span>
          </label>
        </div>
        <div className="flex w-full">{formTitle({ title: "대회명" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="cupName"
            id="cupName"
            value={cupInfo.cupName}
            onChange={(e) => handleCupInfo(e)}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full">{formTitle({ title: "회차" })}</div>
        <div className={inputBoxStyle} style={{ width: "75px" }}>
          <input
            type="text"
            maxLength="3"
            name="cupCount"
            id="cupCount"
            value={cupInfo.cupCount}
            onChange={(e) => handleCupInfo(e)}
            className={inputTextStyle}
          />
          <span className="text-white flex justify-center items-center mr-2 text-sm">
            회
          </span>
        </div>
        <div className="flex w-full">{formTitle({ title: "주최기관" })}</div>
        <div className={inputBoxStyle}>
          {orgList.length && (
            <select
              name="cupOrg"
              className="bg-transparent border-transparent focus:border-transparent focus:ring-0 text-white text-sm appearance-none p-0 px-2 w-1/2"
              onChange={(e) => setCupOrg((prev) => (prev = e.target.value))}
            >
              <option disabled selected>
                협회선택
              </option>
              {orgList.map((item, idx) => (
                <option
                  className="bg-transparent text-sm text-gray-800 border-transparent focus:border-transparent focus:ring-0"
                  value={item.orgName}
                >
                  {item.orgName}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex w-full">{formTitle({ title: "장소" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="cupLocation"
            id="cupLocation"
            value={cupInfo.cupLocation}
            onChange={(e) => handleCupInfo(e)}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full">{formTitle({ title: "참가비" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="cupPrice"
            id="cupPrice"
            value={Number(fee.basicFee).toLocaleString()}
            onChange={(e) =>
              setFee(
                (prev) =>
                  (prev = { ...fee, basicFee: e.target.value.replace(",", "") })
              )
            }
            className={inputTextStyle}
          />
          <div className="flex w-full justify-end items-center gap-x-2 mr-2">
            <button
              className="bg-blue-500 text-white w-14 h-7 rounded-xl text-sm"
              onClick={() =>
                setFee(
                  (prev) =>
                    (prev = {
                      ...fee,
                      basicFee: fee.basicFee + 100000,
                    })
                )
              }
            >
              +10만
            </button>
            <button
              className="bg-blue-500 text-white w-14 h-7 rounded-xl text-sm"
              onClick={() =>
                setFee(
                  (prev) =>
                    (prev = {
                      ...fee,
                      basicFee: fee.basicFee + 50000,
                    })
                )
              }
            >
              +5만
            </button>
            <button
              className="bg-blue-500 text-white w-14 h-7 rounded-xl text-sm"
              onClick={() =>
                setFee(
                  (prev) =>
                    (prev = {
                      ...fee,
                      basicFee: fee.basicFee + 10000,
                    })
                )
              }
            >
              +1만
            </button>
            <button
              className="bg-blue-500 text-white w-14 h-7 rounded-xl text-sm"
              onClick={() =>
                setFee(
                  (prev) =>
                    (prev = {
                      ...fee,
                      basicFee: 0,
                    })
                )
              }
            >
              초기화
            </button>
          </div>
        </div>

        <div className="flex w-full mt-5">
          {formTitle({ title: "복수 종목 참가비" })}
          <div className="flex gap-x-2 justify-end items-center bg-slate-400 px-1 h-8 rounded-full">
            <label htmlFor="priceExtraType1">
              <input
                type="radio"
                name="priceExtraType"
                id="priceExtraType1"
                value="정액"
                className="hidden"
                onClick={(e) =>
                  setFee(
                    (prev) =>
                      (prev = {
                        ...fee,
                        extraType: e.target.value,
                      })
                  )
                }
              />
              {fee.extraType === "정액" ? (
                <div className="bg-blue-500 text-white w-14 h-7 rounded-xl text-sm justify-center items-center flex hover:cursor">
                  정액
                </div>
              ) : (
                <div className="bg-slate-400 text-gray-800 font-semibold w-14 h-7 rounded-xl text-sm justify-center items-center flex hover:cursor-pointer">
                  정액
                </div>
              )}
            </label>
            <label htmlFor="priceExtraType2">
              <input
                type="radio"
                name="priceExtraType"
                id="priceExtraType2"
                value="누적"
                className="hidden"
                onClick={(e) =>
                  setFee(
                    (prev) =>
                      (prev = {
                        ...fee,
                        extraType: e.target.value,
                      })
                  )
                }
              />
              {fee.extraType === "누적" ? (
                <div className="bg-blue-500 text-white w-14 h-7 rounded-xl text-sm justify-center items-center flex hover:cursor-pointer">
                  누적
                </div>
              ) : (
                <div className="bg-slate-400 text-gray-800 font-semibold w-14 h-7 rounded-xl text-sm justify-center items-center flex hover:cursor-pointer">
                  누적
                </div>
              )}
            </label>
            <label htmlFor="priceExtraType3">
              <input
                type="radio"
                name="priceExtraType"
                id="priceExtraType3"
                value="없음"
                className="hidden"
                onClick={(e) =>
                  setFee(
                    (prev) =>
                      (prev = {
                        ...fee,
                        extraType: e.target.value,
                      })
                  )
                }
              />
              {fee.extraType === "없음" ? (
                <div className="bg-blue-500 text-white w-14 h-7 rounded-xl text-sm justify-center items-center flex hover:cursor-pointer">
                  없음
                </div>
              ) : (
                <div className="bg-slate-400 text-gray-800 font-semibold w-14 h-7 rounded-xl text-sm justify-center items-center flex hover:cursor-pointer">
                  없음
                </div>
              )}
            </label>
          </div>
        </div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="cupPriceExtra"
            id="cupPriceExtra"
            value={Number(fee.extraFee).toLocaleString()}
            onChange={(e) =>
              setFee(
                (prev) =>
                  (prev = { ...fee, extraFee: e.target.value.replace(",", "") })
              )
            }
            className={inputTextStyle}
          />
          <div className="flex w-full justify-end items-center gap-x-2 mr-2">
            <button
              className="bg-blue-500 text-white w-14 h-7 rounded-xl text-sm"
              onClick={() =>
                setFee(
                  (prev) =>
                    (prev = {
                      ...fee,
                      extraFee: fee.extraFee + 100000,
                    })
                )
              }
            >
              +10만
            </button>
            <button
              className="bg-blue-500 text-white w-14 h-7 rounded-xl text-sm"
              onClick={() =>
                setFee(
                  (prev) =>
                    (prev = {
                      ...fee,
                      extraFee: fee.extraFee + 50000,
                    })
                )
              }
            >
              +5만
            </button>
            <button
              className="bg-blue-500 text-white w-14 h-7 rounded-xl text-sm"
              onClick={() =>
                setFee(
                  (prev) =>
                    (prev = {
                      ...fee,
                      extraFee: fee.extraFee + 10000,
                    })
                )
              }
            >
              +1만
            </button>
            <button
              className="bg-blue-500 text-white w-14 h-7 rounded-xl text-sm"
              onClick={() =>
                setFee(
                  (prev) =>
                    (prev = {
                      ...fee,
                      extraFee: 0,
                    })
                )
              }
            >
              초기화
            </button>
          </div>
        </div>

        <div className="flex w-full">{formTitle({ title: "일자" })}</div>
        <div>
          {/* <input
            type="text"
            name="cupDate"
            id="cupDate"
            value={cupInfo.cupDate}
            onChange={(e) => handleCupInfo(e)}
            className={inputTextStyle}
          /> */}
          <Datepicker
            value={cupDate}
            asSingle
            useRange={false}
            onChange={(value) => setCupDate((prev) => (prev = value))}
            classNames="dark:slate-800"
          />
        </div>
      </div>
    </div>
  );
};
