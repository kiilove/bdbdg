import { useContext, useEffect, useMemo, useRef } from "react";
import { db } from "../firebase";

import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { formTitle, widgetTitle } from "../components/Titles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { Modal } from "@mui/material";

import ImageForm from "../components/ImageForm";
import { NewcupContext } from "../context/NewcupContext";
import Moment from "react-moment";
import moment from "moment";

const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-1";

const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white focus:ring-0";

export const NewCupInfo = ({
  prevSetState,
  prevState,
  id,
  parentsModalState,
}) => {
  const { dispatch, newCup } = useContext(NewcupContext);
  const [cupInfo, setCupInfo] = useState({});
  const [orgList, setOrgList] = useState([]);
  const [cupOrg, setCupOrg] = useState("");
  const [cupState, setCupState] = useState("");
  const [posterList, setPosterList] = useState([...(cupInfo.cupPoster || [])]);
  const [resUploadURL, setResUploadURL] = useState([]);
  const [posterTitle, setPosterTitle] = useState({});
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState();
  const [cupDate, setCupDate] = useState({});

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
    // console.log(newCup),
    [cupInfo]
  );
  useMemo(() => console.log(orgList), [orgList]);
  useMemo(() => getOrgCollection(), []);
  useMemo(() => setCupInfo((prev) => (prev = newCup.cupInfo)) || {}, []);
  useMemo(() => {
    newCup.cupInfo.cupPoster &&
      setPosterList([...newCup.cupInfo.cupPoster] || []);

    newCup.cupInfo.cupOrg && setCupOrg(newCup.cupInfo.cupOrg || "");
    newCup.cupInfo.cupDate &&
      setCupDate(newCup.cupInfo.cupDate || { startDate: new Date() });
    newCup.cupInfo.cupState &&
      setCupState(newCup.cupInfo.cupState || "대회준비중");
  }, []);

  useMemo(
    () =>
      setCupInfo((prev) => ({
        ...prev,
        cupOrg: cupOrg,
        cupPoster: posterList,
        cupDate: cupDate,
        cupState: cupState,
      })),
    [cupOrg, posterList, cupDate, cupState]
  );

  useMemo(
    () =>
      setCupInfo((prev) => ({
        ...prev,
        cupDate: cupDate,
      })),
    [cupDate]
  );

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border"
      style={{ minWidth: "800px", maxWidth: "1000px" }}
    >
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
          />
          {/* 이미지 업로드 폼 끝 */}
        </div>
      </div>
      <div className="flex w-2/3 h-full flex-col flex-wrap box-border">
        <div className="flex w-full">{formTitle({ title: "대회상태" })}</div>
        <div className="flex w-full gap-x-5">
          <label className="flex w-1/5 justify-center items-center">
            <input
              type="radio"
              name="cupState"
              id="cupState1"
              value="대회준비중"
              checked={cupState === "대회준비중"}
              onChange={(e) => setCupState((prev) => (prev = e.target.value))}
            />
            <span className="flex justify-start items-center text-white text-sm ml-3">
              대회준비중
            </span>
          </label>
          <label className="flex w-1/5 justify-center items-center">
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
          <label className="flex w-1/5 justify-center items-center">
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
              {orgList.map((item, idx) => (
                <option
                  className="bg-transparent text-sm text-gray-800 border-transparent focus:border-transparent focus:ring-0"
                  value={item.orgName}
                  selected={item.orgName === cupOrg}
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
