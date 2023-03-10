import React, { useContext, useMemo } from "react";
import { faPenToSquare, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { EditcupContext } from "../context/EditcupContext";
import { Modal } from "@mui/material";
import { widgetTitle } from "./Titles";
import { EditAssignGameCategory } from "../modals/EditAssignGamesCategory";
import { EditCupManage } from "../modals/EditCupManage";
import EditAssignPlayers from "../modals/EditAssignPlayers";
import useFirestore from "../customhooks/useFirestore";
import useFirestoreSearch from "../customhooks/useFirestoreSearch";
import { where } from "firebase/firestore";

const PLAYER_ORDER_HEADERS = [
  { title: "경기순서", size: "10%" },
  { title: "이름", size: "45%" },
  { title: "연락처", size: "45%" },
];

const PlayerOrderTable = (props) => {
  const [modal, setModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [modalComponent, setModalComponent] = useState();
  const [getCupData, setGetCupData] = useState({});
  const [getGame, setGetGame] = useState([]);
  const [getJoinPlayers, setGetJoinPlayers] = useState([]);
  const [orderPlayers, setOrderPlayers] = useState([]);

  const handleOpenModal = ({ component }) => {
    setModalComponent(() => component);
    setModal(() => true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(() => false);
  };

  const handleOnDragEnd = (result) => {
    // if (!result.destination) return;
    // const items = Array.from(gamesCategory);
    // const [reorderedItem] = items.splice(result.source.index, 1);
    // items.splice(result.destination.index, 0, reorderedItem);
    // setOrderPlayers(handleReOrder(items));
  };

  const handleReOrder = (data) => {
    const prevOrder = [...data];
    let newOrder = [];
    prevOrder.map((item, idx) => newOrder.push({ ...item, index: idx + 1 }));

    return newOrder;
  };

  useMemo(() => {
    if (!getCupData.id) {
      return;
    }

    if (getCupData.gamesCategory.length) {
      const currentGame = getCupData.gamesCategory.find(
        (game) => game.id === props.data.gameId
      );

      console.log(currentGame);
      setGetGame({ ...currentGame });
    }
  }, [getCupData]);

  useEffect(() => {
    setGetCupData(props.data.cupData);
    return () => {
      setGetCupData([]);
    };
  }, []);

  return (
    <div
      className="flex w-full  h-full p-3 rounded-xl flex-col align-top justify-start gap-y-3"
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
              {widgetTitle({ title: "체급 선수 명단" })}
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

      <div className="flex items-center justify-start bg-slate-800 w-full h-12 rounded-xl px-5 gap-x-2">
        <div className="flex justify-between w-full">
          <div className="flex justify-center items-center">
            <FontAwesomeIcon
              icon={props.data.titleIcon}
              className="text-white text-base mr-2"
            />
            <span className="text-white text-base ">{props.data.title}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start w-full h-full rounded-xl  gap-x-2 flex-wrap overflow-y-auto">
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
                        {PLAYER_ORDER_HEADERS.map((item, idx) => (
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
                      {getGame.id &&
                        getGame.map((items, idx) => {
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
                                    {items.idx + 1}
                                  </td>
                                  <td
                                    className="text-white text-sm font-semibold py-3 px-6"
                                    key={items.pName + idx}
                                  >
                                    {items.pName}
                                  </td>
                                  <td
                                    className="text-white text-sm font-semibold py-3 px-6"
                                    key={items.pEmail + idx}
                                  >
                                    {items.pEmail}
                                  </td>
                                  <td
                                    className="text-white text-sm font-semibold py-3 px-6"
                                    key={items.pTel + idx}
                                  >
                                    {items.pTel}
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

export default PlayerOrderTable;
