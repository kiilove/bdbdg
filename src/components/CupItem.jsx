import { async } from "@firebase/util";
import {
  faEye,
  faInfo,
  faList12,
  faPenToSquare,
  faTrashCan,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";
import ConfirmationModal from "../modals/ConfirmationModal";

const CupItem = ({
  cupId,
  cupInfoId,
  cupName,
  cupCount,
  cupDate,
  cupState,
  cupPoster,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteDoc(doc(db, "cups", cupId));
    } catch (error) {
      console.log(error);
    }
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const message = {
    title: "삭제확인",
    body: "해당 대회 정보를 삭제하시겠습니까?",
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
  };
  return (
    <div
      className="flex flex-wrap box-border p-5 rounded-lg"
      style={{ width: "480px", backgroundColor: "rgba(7,11,41,0.4)" }}
    >
      <div className="flex flex-col w-full">
        <div className="flex w-full gap-x-5">
          <div className="flex">
            <img
              src={cupPoster}
              className="flex w-36 h-36 rounded-md object-cover object-top"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-white font-medium text-sm">
              {cupName} {cupCount}회
            </p>

            <p className="text-white">
              <span className=" text-gray-300 font-light text-xs">
                개최일자 :{" "}
              </span>
              <span className="text-gray-300 font-light text-xs">
                {cupDate}
              </span>
            </p>
            <p className="text-white">
              <span className="text-gray-400 font-light text-xs">상태 : </span>
              <span className="text-gray-400 font-light text-xs">
                {cupState}
              </span>
            </p>
          </div>
        </div>
        <div className="flex w-full h-10 justify-center items-center">
          <div
            className="w-full"
            style={{
              height: "1px",
              background: "radial-gradient(farthest-side,#a3a3a3, #2a1b81)",
            }}
          ></div>
        </div>
        <div className="flex w-full gap-x-3">
          <div className="flex w-1/2">
            <div className="flex justify-center items-center w-10 h-10 bg-yellow-500 rounded-xl hover:cursor-pointer">
              <FontAwesomeIcon icon={faTrophy} className="text-white text-lg" />
            </div>
          </div>
          <div className="flex w-1/2 gap-x-3 justify-end">
            <div
              className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl hover:cursor-pointer"
              onClick={() => {
                window.location.href = `/cupinfo/${cupId}`;
              }}
            >
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="text-white text-lg"
              />
            </div>
            <button
              className="flex justify-center items-center w-10 h-10 bg-orange-500 rounded-xl hover:cursor-pointer"
              onClick={() => {
                handleDeleteClick();
              }}
            >
              <FontAwesomeIcon
                icon={faTrashCan}
                className="text-white text-lg"
              />
            </button>
            <ConfirmationModal
              isOpen={isModalOpen}
              onConfirm={handleDeleteConfirm}
              onCancel={handleModalClose}
              message={message}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CupItem;
