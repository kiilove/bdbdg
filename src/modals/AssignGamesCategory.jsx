import React, { useContext, useMemo, useState } from "react";
import { OutlineButton } from "../assets/forms/button";
import { Decrypter } from "../components/Encrypto";
import { NewcupContext } from "../context/NewcupContext";

const AssignGamesCategory = () => {
  const [checked, setChecked] = useState([]);
  const [gameCategory, setGameCategory] = useState([]);
  const [gameClass, setGameClass] = useState([]);

  const { dispatch, newCup } = useContext(NewcupContext);

  useMemo(() => {
    setGameCategory(() => newCup.gamesCategory || []);
    //console.log(assign);
  }, []);

  useMemo(() => {
    dispatch({
      type: "KEEP",
      payload: {
        cupData: {
          ...newCup,
          cupInfo: { ...newCup.cupInfo },
          gamesCategory: [...gameCategory] || [],
        },
      },
    });
    //console.log("pool", pool);
  }, [gameCategory]);

  const handleToggleCategory = (cateId) => {};

  const customList = (items) => {
    return (
      <div className="flex w-full h-72 overflow-auto">
        <div className="flex flex-col gap-y-2 w-full p-1">
          {items.length > 0 &&
            items.map((value, idx) => (
              <div
                className={`flex h-13 w-full p-3 justify-center items-start border-0 border-gray-400 rounded-md bg-slate-800  ${
                  value.launched && " border-sky-700 "
                }`}
              >
                <div className="flex items-center h-5 justify-center ">
                  <input
                    type="checkbox"
                    tabIndex={-1}
                    checked={value.launched}
                    id={`itemsGamesCategoryCheckbox-${value.id}`}
                    onClick={handleToggleCategory(value.id)}
                    className="w-4 h-4 bg-pink-100 border-pink-300 text-pink-500 focus:ring-red-200 border-0 rounded-lg focus:ring-0"
                  />
                </div>
                <div className="ml-2 text-md w-full h-full">
                  <label
                    id
                    htmlFor={`itemsGamesCategoryCheckbox-${value.id}`}
                    className="font-medium text-gray-900 dark:text-gray-300 w-full h-full flex "
                  >
                    <div className="flex w-full items-center gap-x-3">
                      <div className="flex flex-col w-full gap-y-3">
                        <p className=" text-sm text-gray-300">{value.title}</p>
                        <div className="flex w-full bg-gray-800">
                          {value.class.map((title, idx) => (
                            <div className="flex w-full justify-start items-center gap-x-2">
                              <input
                                type="checkbox"
                                tabIndex={-1}
                                checked={title.launched}
                                id={`itemsClassCheckbox-${value.id}`}
                                className="w-3 h-3 bg-blue-100 border-blue-300 text-blue-500 focus:ring-blue-200 border-0 focus:ring-0 text-xs"
                              />
                              <label
                                id
                                htmlFor={`itemsClassCheckbox-${value.id}`}
                                className="font-medium text-gray-900 dark:text-gray-300 w-full h-full flex "
                              >
                                <span className="text-white mr-2 text-sm">
                                  {title.title}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border"
      style={{ minWidth: "800px", maxWidth: "1000px" }}
    >
      <div className="flex w-full">
        <div className="flex w-full py-5">
          <div className="flex flex-col w-full bg-slate-900 rounded-lg p-2 gap-y-2">
            <div className="flex rounded-lg p-3">
              <span className="text-white font-semibold">
                전체목록({gameCategory && gameCategory.length})
              </span>
            </div>
            <div className="flex w-full justify-start  rounded-lg p-3">
              {gameCategory ? customList(gameCategory) : <div></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignGamesCategory;
