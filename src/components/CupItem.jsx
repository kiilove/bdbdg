import {
  faEye,
  faPenToSquare,
  faTrashCan,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const CupItem = (props) => {
  return (
    <div
      className="flex flex-wrap box-border p-5 rounded-lg"
      style={{ width: "380px", backgroundColor: "rgba(7,11,41,0.4)" }}
    >
      <div className="flex flex-col w-full">
        <div className="flex w-full gap-x-5">
          <div className="flex">
            <img
              src={props.data.cupInfo.cupPoster}
              className="flex w-36 h-36 rounded-md object-cover object-top"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <p className="text-white font-medium text-sm">
              {props.data.cupInfo.cupName} {props.data.cupInfo.cupCount}회
            </p>

            <p className="text-white">
              <span className=" text-gray-300 font-light text-xs">
                개최일자 :{" "}
              </span>
              <span className="text-gray-300 font-light text-xs">
                {props.data.cupInfo.cupDate}
              </span>
            </p>
            <p className="text-white">
              <span className="text-gray-400 font-light text-xs">상태 : </span>
              <span className="text-gray-400 font-light text-xs">
                {props.data.cupStatus}
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
                window.location.href = `/cupview/${props.id}`;
              }}
            >
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="text-white text-lg"
              />
            </div>
            <div className="flex justify-center items-center w-10 h-10 bg-orange-500 rounded-xl hover:cursor-pointer">
              <FontAwesomeIcon
                icon={faTrashCan}
                className="text-white text-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CupItem;
