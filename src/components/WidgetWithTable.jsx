import {
  faPenToSquare,
  faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Tables from "./Tables";

const WidgetWithTable = (props) => {
  // console.log(props.data.tableData);
  return (
    <div
      className="flex w-full  h-96 p-8 rounded-lg flex-col align-top justify-start gap-y-3"
      style={{ backgroundColor: "rgba(7,11,41,0.6" }}
    >
      <div className="flex items-center justify-start bg-slate-800 w-full h-14 rounded-xl px-5 gap-x-2">
        <div className="flex justify-between w-full">
          <div className="flex justify-center items-center">
            <FontAwesomeIcon
              icon={props.data.titleIcon}
              className="text-white text-xl mr-2"
            />
            <span className="text-white text-xl ">{props.data.title}</span>
          </div>
          <div className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl">
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="text-white text-lg"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-start w-full h-64 rounded-xl  gap-x-2 flex-wrap overflow-y-auto">
        <div className="flex w-full justify-center">
          {props.data.tableData ? (
            <Tables
              headers={props.data.tableHeaders}
              data={props.data.tableData}
            />
          ) : (
            <span className="text-white text-lg">
              현재 표시할 내용이 없습니다.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WidgetWithTable;
