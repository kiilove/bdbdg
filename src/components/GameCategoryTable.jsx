import React, { useContext, useMemo } from "react";
import { faPenToSquare, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { EditcupContext } from "../context/EditcupContext";
import { Modal } from "@mui/material";
import { widgetTitle } from "./Titles";
import { EditAssignGameCategory } from "../modals/EditAssignGamesCategory";

const GAME_HEADERS = [
  { title: "경기순서", size: "10%" },
  { title: "종목명", size: "15%" },
  { title: "체급 / 확정 선수", size: "30%" },
  { title: "참가신청", size: "10%" },
  { title: "심판배정", size: "10%" },
  { title: "액션", size: "10%" },
];

const GameCategoryTable = (props) => {
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [modalComponent, setModalComponent] = useState();
  const [gamesCategory, setGamesCategory] = useState([]);

  const handleOpenModal = ({ component }) => {
    setModalComponent(() => component);
    setModal(() => true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(() => false);
  };

  const handleOpenModal2 = ({ component }) => {
    setModalComponent(() => component);
    setModal2(() => true);
  };

  const handleCloseModal2 = () => {
    setModalComponent("");
    setModal2(() => false);
  };
  const { dispatch, editCup } = useContext(EditcupContext);

  useMemo(
    () => setGamesCategory((prev) => (prev = editCup.gamesCategory)),
    [editCup]
  );

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(gamesCategory);
    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem);
    setGamesCategory(handleReOrder(items));
  };

  const handleReOrder = (data) => {
    const prevOrder = [...data];
    let newOrder = [];
    prevOrder.map((item, idx) => newOrder.push({ ...item, index: idx + 1 }));

    return newOrder;
  };

  useMemo(
    () =>
      dispatch({
        type: "EDIT",
        payload: { cupData: { ...editCup, gamesCategory } },
      }),
    [gamesCategory]
  );

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
              {widgetTitle({ title: "새종목 등록" })}
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
      <Modal open={modal2} onClose={handleCloseModal2}>
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
              {widgetTitle({ title: "종목 수정" })}
            </div>
            <div
              className="flex w-1/2 justify-end items-center hover:cursor-pointer"
              onClick={() => handleCloseModal2()}
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
          <div className="flex w-full">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <table
                    ref={provided.innerRef}
                    className="w-full text-sm text-left text-gray-500"
                  >
                    <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                      <tr className="">
                        {GAME_HEADERS.map((item, idx) => (
                          <th
                            className="py-3 px-6 "
                            key={item.title}
                            id={item.title}
                            style={{ width: item.size }}
                          >
                            {item.title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {gamesCategory &&
                        gamesCategory.map((items, idx) => {
                          return (
                            <Draggable
                              key={items.id}
                              draggableId={items.id}
                              id={items.id}
                              index={idx}
                            >
                              {(provided, snapshot) => (
                                <tr
                                  className={`border-b border-gray-700 ${
                                    snapshot.isDragging ? "bg-sky-600" : ""
                                  }`}
                                  key={items + idx}
                                  id={items.id + "tr"}
                                  ref={provided.innerRef}
                                  {...provided.dragHandleProps}
                                  {...provided.draggableProps}
                                >
                                  <td
                                    className="text-white text-sm font-semibold py-3 px-6"
                                    id={items.index + idx}
                                    key={items.index + idx}
                                  >
                                    {items.index}
                                  </td>
                                  <td
                                    className="text-white text-sm font-semibold py-3 px-6"
                                    key={items.title + idx}
                                  >
                                    {items.launched ? (
                                      <span>{items.title}</span>
                                    ) : (
                                      <span className=" line-through font-light italic text-gray-500">
                                        {items.title}
                                      </span>
                                    )}
                                  </td>
                                  <td
                                    className="text-white text-sm font-semibold py-3 px-6"
                                    key={items.class + idx}
                                  >
                                    <div className="flex w-full flex-wrap gap-2">
                                      {items.launched ? (
                                        
                                        items.class.map((item, cIdx) => (
                                          <span className="bg-blue-500 py-1 px-2 text-xs rounded-lg">
                                            {item.title}
                                            {item.players &&
                                              ` / ${item.players.length}`}
                                          </span>
                                        ))
                                      ) : (
                                        <div>
                                          <span className="font-light italic text-gray-500">
                                            종목 개최 안함
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td
                                    className="text-white text-sm font-semibold py-3 px-6"
                                    key={items.player + idx}
                                  >
                                    {items.players && items.players.length}
                                  </td>
                                  <td
                                    className="text-white text-sm font-semibold py-3 px-6"
                                    key={items.referee + idx}
                                  >
                                    {!items.refereeAssign
                                      ? "배정안됨"
                                      : items.refereeAssign.length > 0
                                      ? items.refereeAssign.length
                                      : "배정안됨"}
                                  </td>
                                  <td
                                    className="text-white text-sm font-semibold py-3 px-6"
                                    key={items.action + idx}
                                  >
                                    <button
                                      onClick={() =>
                                        handleOpenModal2({
                                          component: (
                                            <EditAssignGameCategory
                                              pSetModal={modal2}
                                              pSetRefresh={setRefresh}
                                              pGameId={items.id}
                                              pIndex={idx}
                                            />
                                          ),
                                        })
                                      }
                                    >
                                      <FontAwesomeIcon
                                        icon={faPenToSquare}
                                        className="text-white text-lg"
                                      />
                                    </button>
                                  </td>
                                </tr>
                              )}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </tbody>
                  </table>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCategoryTable;
