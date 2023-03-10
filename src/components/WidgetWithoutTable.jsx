import {
  faPenToSquare,
  faScaleBalanced,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "@mui/material";
import React from "react";
import { useState } from "react";
import { BasicTable } from "./Tables";
import { widgetTitle } from "./Titles";

const WidgetWithoutTable = (props) => {
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState();

  const handleOpenModal = ({ component }) => {
    setModalComponent(() => component);
    console.log(component);
    setModal(() => true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(() => false);
  };
  return (
    <div
      className={`flex w-full p-3 h-full rounded-xl flex-col align-top justify-start gap-y-3 ${
        props.mystyle ? props.mystyle.height : "h-96"
      }`}
      style={{ backgroundColor: "rgba(7,11,41,0.6" }}
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
          <div className="flex w-full ">
            <div className="flex w-1/2">
              {widgetTitle({
                title: props.data.modalTitle || props.data.title,
              })}
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
      <div
        className={`flex items-center justify-start w-full rounded-xl  gap-x-2 flex-wrap overflow-y-auto  ${
          props.mystyle ? props.mystyle.height : "h-64"
        }`}
      >
        <div className="flex w-full justify-center">
          {props.data.tableData ? (
            <BasicTable
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

export default WidgetWithoutTable;
