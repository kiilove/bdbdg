import { useEffect } from "react";
import { db } from "../firebase";

import { useState } from "react";
import { formTitle, widgetTitle } from "../components/Titles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { doc, setDoc } from "firebase/firestore";
import { Modal } from "@mui/material";

import ImageForm from "../components/ImageForm";

const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-1";

const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white focus:ring-0";

export const EditCupInfo = ({ prevState, prevInfo, id, parentsModalState }) => {
  const [cupInfo, setCupInfo] = useState({ ...prevInfo });
  const [cupId, setCupId] = useState();
  const [posterList, setPosterList] = useState([...prevInfo.cupPoster]);
  const [resUploadURL, setResUploadURL] = useState([...prevInfo.cupPoster]);
  const [posterTitle, setPosterTitle] = useState({});
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState();

  const updateCupInfo = async () => {
    console.log("updateCupInfo", cupInfo);
    try {
      const updateDoc = await setDoc(
        doc(db, "cups", cupId),
        { cupInfo },
        { merge: true }
      );
    } catch (error) {
      console.log(error.message);
    } finally {
      prevState({ ...prevState, ...cupInfo });

      console.log("updateSetDoc", "Successfully updated");
    }
  };
  const handleCupInfo = (e) => {
    if (e.target.name !== "cupPoster") {
      setCupInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleOpenModal = ({ component }) => {
    setModalComponent(() => component);
    setModal(() => true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(() => false);
  };

  useEffect(() => {
    setCupInfo({ ...cupInfo, cupPoster: posterList });
    console.log(cupInfo);
  }, [posterList]);

  useEffect(() => {
    setCupId(id);
  }, [id]);

  useEffect(() => {
    setCupInfo((prev) => ({ ...prev, cupPoster: resUploadURL }));
  }, [resUploadURL]);

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
          <input
            type="text"
            name="cupOrg"
            id="cupOrg"
            value={cupInfo.cupOrg}
            onChange={(e) => handleCupInfo(e)}
            className={inputTextStyle}
          />
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
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="cupDate"
            id="cupDate"
            value={cupInfo.cupDate}
            onChange={(e) => handleCupInfo(e)}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full h-16 items-center justify-end">
          <button
            onClick={() => updateCupInfo()}
            className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl hover:cursor-pointer"
          >
            <FontAwesomeIcon icon={faSave} className="text-white text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};
