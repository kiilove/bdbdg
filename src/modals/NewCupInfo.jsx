import { useEffect } from "react";
import { useState } from "react";
import { formTitle, widgetTitle } from "../components/Titles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ImageList } from "./ImageList";
import { Modal } from "@mui/material";
import { UploadMultiple } from "../customhooks/useUpload";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-1";

const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white focus:ring-0";

export const NewCupInfo = ({ prevState, prevInfo, id, parentsModalState }) => {
  const [cupInfo, setCupInfo] = useState({ ...prevInfo });
  const [cupId, setCupId] = useState();
  const [resUploadURL, setResUploadURL] = useState([]);
  const [uploadedImageURL, setUploadedImageURL] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState();
  console.log(prevInfo);

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
    prevState({ ...cupInfo });
  }, [cupInfo]);

  useEffect(() => {
    setCupInfo((prev) => ({ ...prev, cupPoster: uploadedImageURL }));
  }, [uploadedImageURL]);

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
          <div className="flex justify-center items-center w-full flex-col gap-y-4">
            <label
              for="cupPoster"
              className="flex flex-col justify-center items-center w-full  rounded-lg border-2 border-gray-300 border-dashed cursor-pointer p-1  hover:bg-blue-800"
            >
              {uploadedImageURL ? (
                <div className="flex flex-col justify-center items-center w-full">
                  <img src={uploadedImageURL} alt="" className="object-cover" />
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center h-32">
                  <svg
                    aria-hidden="true"
                    class="mb-3 w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>

                  <p className="text-xs text-gray-200 font-light">
                    SVG, PNG, JPG
                  </p>
                </div>
              )}

              <input
                type="file"
                id="cupPoster"
                name="cupPoster"
                className="hidden"
                multiple
                onChange={(e) =>
                  UploadMultiple(e, "P", "images/poster/", setUploadedImageURL)
                }
              />
            </label>
            {uploadedImageURL && (
              <div className="flex w-full">
                <div
                  className="flex w-full h-full py-3 rounded-lg"
                  style={{ backgroundColor: "rgba(7,11,41,1)" }}
                >
                  <img
                    src={uploadedImageURL && uploadedImageURL}
                    className="flex w-16 h-16 p-1 border border-gray-300 "
                  />
                </div>
              </div>
            )}

            <div className="flex w-full">
              <button
                className="flex justify-center items-center w-full h-10 bg-sky-500 rounded-xl hover:cursor-pointer"
                onClick={() =>
                  handleOpenModal({ component: <ImageList refType="poster" /> })
                }
              >
                <FontAwesomeIcon
                  icon={faImages}
                  className="text-white text-lg"
                />
                <span className="text-white text-sm font-light ml-3">
                  기존 포스터 찾기
                </span>
              </button>
            </div>
          </div>
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
      </div>
    </div>
  );
};
