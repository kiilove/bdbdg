import React, { useMemo } from "react";
import { faList12 } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import useFirestore from "../customhooks/useFirestore";
import { useParams } from "react-router";
import Loading from "../pages/Loading";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const PlayerOrderTable = ({ id }) => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [headerIdx, setHeaderIdx] = useState({ idx: 0, title: "" });
  const [isEntryGamesList, setIsEntryGamesList] = useState([]);
  const [cupId, setCupId] = useState(id);
  const [refresh, setRefresh] = useState(false);
  const [getCupData, setGetCupData] = useState({});
  const [players, setPlayers] = useState([]);

  const { data: cupData, getDocument: cupGetDocument } = useFirestore();
  const { data: cupUpdateData, updateData: cupUpdate } = useFirestore();

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    const players = [...isEntryGamesList[headerIdx.idx].class.players];
    const removed = players.splice(source.index, 1)[0];
    players.splice(destination.index, 0, removed);

    setIsEntryGamesList(
      reorderPlayers(source.index, destination.index, players)
    );
  };

  const reorderPlayers = (startIndex, endIndex, players) => {
    const newIsEntryGamesList = [...isEntryGamesList];
    newIsEntryGamesList[headerIdx.idx].class.players = players;
    updateGameData(
      headerIdx.gameTitle,
      headerIdx.classTitle,
      newIsEntryGamesList[headerIdx.idx].class.players
    );
    console.log(newIsEntryGamesList);
    return newIsEntryGamesList;
  };

  const updateGameData = (gameTitle, classTitle, players) => {
    const updatedGamesCategory = getCupData.gamesCategory.map((category) => {
      if (category.title === gameTitle) {
        const updatedClass = category.class.map((classItem) => {
          if (classItem.title === classTitle) {
            return {
              ...classItem,
              players: [...players],
            };
          } else {
            return classItem;
          }
        });
        return {
          ...category,
          class: updatedClass,
        };
      } else {
        return category;
      }
    });
    setGetCupData({
      ...getCupData,
      gamesCategory: updatedGamesCategory,
    });
    console.log(getCupData);
    cupUpdate("cups", cupId, {
      ...getCupData,
      gamesCategory: updatedGamesCategory,
    });
  };

  const filterIsEntryGamesList = (data) => {
    if (!data.id) {
      return;
    }

    const validClasses = data.gamesCategory.flatMap((category) =>
      category.class.flatMap((classItem) => {
        if (Array.isArray(classItem.players) && classItem.players.length > 0) {
          return {
            class: classItem,
            gameTitle: category.title,
            classTitle: classItem.title,
          };
        }
        return [];
      })
    );
    setIsEntryGamesList([...validClasses]);
    setHeaderIdx({ idx: 0, title: validClasses[0]?.title });
  };

  useMemo(() => {
    if (!cupData.id) {
      return;
    }
    setGetCupData({ ...cupData });

    setIsLoading(false);
    filterIsEntryGamesList(cupData);
  }, [cupData]);

  useEffect(() => {
    if (!id) {
      return;
    }
    cupGetDocument("cups", id);
  }, []);

  return (
    <div className="flex w-full h-full">
      {isLoading && <Loading />}
      {getCupData.id && (
        <div
          className="flex w-full  h-full p-3 rounded-xl flex-col align-top justify-start gap-y-3"
          style={{ backgroundColor: "rgba(7,11,41,0.6)" }}
        >
          <div className="flex items-center justify-start bg-slate-800 w-full h-12 rounded-xl px-5 gap-x-2">
            <div className="flex justify-between w-full">
              <div className="flex justify-center items-center">
                <FontAwesomeIcon
                  icon={faList12}
                  className="text-white text-base mr-2"
                />
                <span className="text-white text-base ">
                  종목별 선수 출전순서 관리(출전 선수가 있는 종목만 나타납니다.)
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full h-full justify-between">
            <div className="flex w-1/2 h-full border-gray-400 rounded-xl bg-slate-900 p-1 flex-wrap gap-x-2">
              {isEntryGamesList.length &&
                isEntryGamesList.map((games, tIdx) => (
                  <button
                    className="flex h-12 justify-center items-center p-1"
                    style={{ minWidth: "250px" }}
                    onClick={() => {
                      setHeaderIdx({
                        idx: tIdx,
                        gameTitle: games.gameTitle,
                        classTitle: games.classTitle,
                      });
                    }}
                  >
                    <div
                      className={`h-full w-full ${
                        headerIdx.idx === tIdx ? "bg-white" : ""
                      } rounded-xl justify-center items-start flex hover:cursor-pointer flex-col`}
                    >
                      <span
                        className={`text-white ml-4 text-sm ${
                          headerIdx.idx === tIdx ? "text-black" : ""
                        }`}
                      >
                        {`${games.gameTitle}(${games.classTitle})`}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
            <div className="flex w-1/2 justify-end">
              <div
                className="flex justify-center items-start bg-slate-900 rounded-lg"
                style={{ width: "700px" }}
              >
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="playerOrder">
                    {(provided, snapshot) => (
                      <table
                        className="flex flex-col text-sm text-left text-gray-500"
                        style={{ width: "500px" }}
                        ref={provided.innerRef}
                      >
                        <thead className=" text-gray-400 uppercase border-b border-gray-700 flex">
                          <tr>
                            <th className="py-3 px-6 w-40">출전순서</th>
                            <th className="py-3 px-6 w-40">이름</th>
                            <th className="py-3 px-6 w-40">전화번호</th>
                          </tr>
                        </thead>
                        {isEntryGamesList.length &&
                          isEntryGamesList[headerIdx.idx].class.players.map(
                            (player, pIdx) => (
                              <Draggable
                                key={player.pName}
                                draggableId={player.pName}
                                index={pIdx}
                              >
                                {(provided, snapshot) => (
                                  <tr
                                    className={`border-b border-gray-700 ${
                                      snapshot.isDragging ? "bg-sky-600" : ""
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <td className="text-white text-sm font-semibold py-3 px-6 w-40">
                                      {pIdx + 1}
                                    </td>
                                    <td className="text-white text-sm font-semibold py-3 px-6 w-40">
                                      {player.pName}
                                    </td>
                                    <td className="text-white text-sm font-semibold py-3 px-6 w-40">
                                      {player.pTel || ""}
                                    </td>
                                  </tr>
                                )}
                              </Draggable>
                            )
                          )}
                        {provided.placeholder}
                      </table>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerOrderTable;
