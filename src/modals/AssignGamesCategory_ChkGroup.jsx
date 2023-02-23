import React, { useContext, useMemo, useState } from "react";
import { OutlineButton } from "../assets/forms/button";
import { Decrypter } from "../components/Encrypto";
import { NewcupContext } from "../context/NewcupContext";
import Checkbox from "../forms/checkbox/Checkbox";
import CheckboxGroup from "../forms/checkbox/CheckboxGroup";

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
          <CheckboxGroup>
            {items.map((item, idx) => (
              <Checkbox>
                <span>{item}</span>
              </Checkbox>
            ))}
          </CheckboxGroup>
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
