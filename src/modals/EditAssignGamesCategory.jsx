import { faEye, faEyeSlash, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Decrypter, Encrypter } from "../components/Encrypto";
import { formTitle } from "../components/Titles";
import { db } from "../firebase";

import { handleToast } from "../components/HandleToast";
import { async } from "@firebase/util";
import { EditcupContext } from "../context/EditcupContext";

const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-1";

const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-gray-500 focus:ring-0";

export const EditAssignGameCategory = ({ pSetModal, pSetRefresh, pGameId }) => {
  const [gameInfo, setGameInfo] = useState({});
  const { dispatch, editCup } = useContext(EditcupContext);

  const handleGame = () => {
    let game = "";
    const gameTitle = editCup.gamesCategory.filter(
      (item) => item.id === pGameId
    );

    if (gameTitle === undefined || gameTitle.length === 0) {
      game = "";
    } else {
      game = gameTitle[0];
    }

    return game;
  };

  const handleChk = (idx) => {
    const dummy = [...gameInfo.class];
    const newChk = {
      title: dummy[idx].title,
      launched: !dummy[idx].launched,
    };

    dummy.splice(idx, 1, newChk);

    const newData = { ...gameInfo, class: [dummy] };
    setGameInfo(() => newData);
    return newData;
  };

  useMemo(() => setGameInfo(handleGame()), []);
  useMemo(() => console.log(gameInfo), [gameInfo]);

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border"
      style={{ minWidth: "800px", maxWidth: "1000px" }}
    >
      <div className="flex w-full h-full p-10">
        <div className="flex flex-col w-5/12 bg-slate-900 rounded-lg p-3 gap-y-2">
          <div className="flex border-gray-400 rounded-md bg-slate-800 h-13">
            <div className="flex w-full h-full p-3">
              <span className="text-white font-semibold">
                {gameInfo.title || ""}
              </span>
            </div>
          </div>
          <div className="flex border-gray-400 rounded-md bg-slate-800 h-13">
            <div className="flex w-full h-full p-3">
              {/* 체크박스 폼컨트롤 해야하나? */}
              {gameInfo.class &&
                gameInfo.class.map((game, idx) => (
                  <div className="flex w-full justify-start items-center gap-x-2">
                    <input
                      type="checkbox"
                      tabIndex={-1}
                      checked={gameInfo.class[idx].launched}
                      onClick={() => handleChk(idx)}
                      id={`itemsClassCheckbox-${game.title}`}
                      className="w-3 h-3 bg-blue-100 border-blue-300 text-blue-500 focus:ring-blue-200 border-0 focus:ring-0 text-xs"
                    />
                    <label
                      id
                      htmlFor={`itemsClassCheckbox-${game.title}`}
                      className="font-medium text-gray-900 dark:text-gray-300 w-full h-full flex "
                    >
                      <span className="text-white mr-2 text-sm">
                        {game.title}
                      </span>
                    </label>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
