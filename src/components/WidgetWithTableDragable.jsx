import {
  faPenToSquare,
  faScaleBalanced,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "@mui/material/Modal";
import React from "react";
import { useState } from "react";
import { TableDragable } from "./Tables";
import { NewGame } from "./Modals";
import { widgetTitle } from "./Titles";

const WidgetWithTableDragable = (props) => {
  // console.log(props.data.tableData);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState();

  const handleOpenModal = ({ component }) => {
    setModalComponent(() => component);
    setModal(() => true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(() => false);
  };
  return (
    <div
      className="flex w-full  h-96 p-8 rounded-lg flex-col align-top justify-start gap-y-3"
      style={{ backgroundColor: "rgba(7,11,41,0.6" }}
    >
      <Modal open={modal} onClose={handleCloseModal}>
        <div
          className="absolute top-1/2 left-1/2 border-0 p-5 outline-none rounded-lg flex flex-col"
          style={{
            backgroundColor: "rgba(7,11,41,0.9",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Modal창을 닫기 위해 제목을 부모창에서 열도록 설계했음 */}
          <div className="flex w-full">
            <div className="flex w-1/2">
              {widgetTitle({ title: "새게임 등록" })}
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
      <div className="flex items-center justify-start bg-slate-800 w-full h-14 rounded-xl px-5 gap-x-2">
        <div className="flex justify-between w-full">
          <div className="flex justify-center items-center">
            <FontAwesomeIcon
              icon={props.data.titleIcon}
              className="text-white text-xl mr-2"
            />
            <span className="text-white text-xl ">{props.data.title}</span>
          </div>
          <div
            className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl hover:cursor-pointer"
            onClick={() =>
              handleOpenModal({ component: props.data.actionComponent })
            }
          >
            {props.data.actionIcon ? (
              <FontAwesomeIcon
                icon={props.data.actionIcon}
                className="text-white text-lg hover:cursor-pointer"
              />
            ) : (
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="text-white text-lg hover:cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start w-full h-64 rounded-xl  gap-x-2 flex-wrap overflow-y-auto">
        <div className="flex w-full justify-center">
          {props.data.tableData ? (
            <TableDragable
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

export default WidgetWithTableDragable;
