import { useMemo, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import useFirestore from "../customhooks/useFirestore";
import Loading from "../pages/Loading";

export const EditAssignGameCategory = (props) => {
  console.log(props);
  const [joinGames, setJoinGames] = useState([]);

  const { data, loading, error, getDocument } = useFirestore();

  const handleJoinGames = (e, gameTitle, gameId) => {
    let dummy = [...joinGames];
    const dummyIndex = dummy.findIndex((game) => game.gameTitle === gameTitle);

    dummyIndex === -1
      ? dummy.push({ id: gameId, gameTitle, gameClass: e.target.value })
      : dummy.splice(dummyIndex, 1, {
          id: gameId,
          gameTitle,
          gameClass: e.target.value,
        });
    setJoinGames((prev) => (prev = dummy));
  };

  const handleRemoveGames = (gameId) => {
    let dummy = [...joinGames];
    const dummyIndex = dummy.findIndex((game) => game.id === gameId);

    dummyIndex !== -1 && dummy.splice(dummyIndex, 1);
    setJoinGames((prev) => (prev = dummy));
  };

  useMemo(() => {
    props.data.cupId && getDocument("cups", props.data.cupId);
  }, [props.data]);

  useMemo(() => {
    if (data.gamesCategory) {
      setJoinGames([...props.data.joinGames]);
    }
  }, [data]);

  useMemo(() => {
    props.prevSetState([...joinGames]);
  }, [joinGames]);

  return (
    <div className="w-full flex flex-col">
      {loading && <Loading />}

      <div
        className="flex w-full h-full flex-col overflow-y-auto"
        style={{ maxWidth: "900px", maxHeight: "800px" }}
      >
        <div className="flex w-full flex-wrap gap-2 justify-between">
          {data.gamesCategory &&
            data.gamesCategory.map((gameItem, gIdx) => (
              <div className="flex flex-col bg-slate-900 rounded-lg p-3 gap-y-2 w-52">
                <div className="flex border-gray-400 rounded-md bg-slate-800 h-13">
                  <div className="flex w-full h-full p-3 items-center">
                    <span className="text-white font-semibold text-sm">
                      {gameItem.title || ""}
                    </span>
                  </div>
                </div>
                <div className="flex border-gray-400 rounded-md bg-slate-800">
                  <div className="flex w-full h-full p-2 flex-wrap box-border">
                    {gameItem.class.length > 0 &&
                      gameItem.class.map((classItem, cIdx) => (
                        <div className="flex justify-start items-center gap-x-2">
                          <input
                            type="radio"
                            id={`${gameItem.title}_${cIdx}`}
                            name={gameItem.title}
                            value={classItem.title}
                            checked={joinGames.some(
                              (games) =>
                                games.id === gameItem.id &&
                                games.gameClass === classItem.title
                            )}
                            onClick={(e) =>
                              handleJoinGames(e, gameItem.title, gameItem.id)
                            }
                            tabIndex={-1}
                            className="w-3 h-3 bg-blue-100 border-blue-300 text-blue-500 focus:ring-blue-200 border-0 focus:ring-0 text-xs"
                          />
                          <label
                            htmlFor={`${gameItem.title}_${cIdx}`}
                            className="font-medium text-gray-900 dark:text-gray-300 w-full h-full flex "
                          >
                            <span className="text-white mr-2 text-sm">
                              {classItem.title}
                            </span>
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex mt-2 p-5 bg-slate-900 rounded-xl flex-wrap">
          {joinGames.length > 0 &&
            joinGames.map((game) => (
              <div className="flex flex-wrap h-full p-2 text-white">
                <span className="bg-blue-500 py-2 p-2 text-sm rounded-lg flex items-center">
                  {game.gameTitle} ({game.gameClass})
                  <button
                    className="flex w-4 h-4 justify-center items-center bg-sky-700 rounded-full ml-2 text-xs"
                    onClick={() => handleRemoveGames(game.id)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
