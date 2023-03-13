import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { EditcupContext } from "../context/EditcupContext";

import { Decrypter, Encrypter } from "../components/Encrypto";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import useFirestore from "../customhooks/useFirestore";

export const EditCupManage = ({ pSetModal, pSetRefresh, pGameId, pIndex }) => {
  const { dispatch, editCup } = useContext(EditcupContext);
  const [gameInfo, setGameInfo] = useState(editCup.gamesCategory[pIndex]);
  const [gamesCategory, setGamesCategory] = useState([
    ...editCup.gamesCategory,
  ]);
  const [classIsTrue, setClassIsTrue] = useState(false);
  const [assignPool, setAssignPool] = useState([]);
  const [assignPoolFiltered, setAssignPoolFiltered] = useState([]);
  const [assign, setAssign] = useState(
    editCup.gamesCategory[pIndex].refereeAssign || []
  );
  const [searchCount, setSearchCount] = useState(undefined);

  const { data: gameData, updateData: gameUpdate } = useFirestore;

  const chkRef = useRef([]);
  const getRefereePool = async () => {
    let dataArray = [];

    const refereeRef = collection(db, "referee");
    const q = query(refereeRef, orderBy("refName"));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        dataArray.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.log(error);
    }

    return new Promise((resolve, reject) => {
      resolve(dataArray);
    });
  };

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

  const handleENC = (data, keyValue) => {
    const dummyKeys = Object.keys(data);
    let dataObj;
    dummyKeys.length > 0 &&
      dummyKeys.map((key) => {
        if (key === keyValue) {
          dataObj = { ...dataObj, [key]: data[key] };
        } else {
          const dencValue = Encrypter(data[key]);
          dataObj = { ...dataObj, [key]: dencValue };
        }
      });
    return dataObj;
  };

  const handleDENC = (data, keyValue) => {
    const dummyArray = [...data];
    let dummyDenc = [];
    dummyArray.map((item, idx) => {
      const dummyKeys = Object.keys(item);
      let dataObj;
      dummyKeys.length > 0 &&
        dummyKeys.map((key) => {
          //console.log(key);
          if (key === keyValue || key === "id") {
            dataObj = { ...dataObj, [key]: item[key] };
          } else {
            const dencValue = Decrypter(item[key]);
            dataObj = { ...dataObj, [key]: dencValue };
          }
        });
      dummyDenc.push({ ...dataObj });
    });

    return dummyDenc;
  };

  const handleChk = (idx) => {
    let classCheck = true;
    const dummy = [...gameInfo.class];
    const newChk = {
      title: dummy[idx].title,
      launched: !dummy[idx].launched,
    };

    dummy.splice(idx, 1, newChk);

    const newData = { ...gameInfo, class: [...dummy] };
    if (!newData.class.some((chk) => chk.launched === true)) {
      classCheck = true;
    } else {
      classCheck = false;
    }

    setClassIsTrue(classCheck);
    setGameInfo(() => newData);
    return newData;
  };

  const handleSearch = (keyword) => {
    const dummy = [...assignPoolFiltered];

    const result = dummy.filter(
      (item) => item.refName.includes(keyword) || item.refTel.includes(keyword)
    );

    setSearchCount(result.length);
    result.length > 0 && setAssignPoolFiltered(result);

    if (keyword.length === 0) {
      setAssignPoolFiltered(handleDENC(editCup.refereeAssign, "refUid"));
    }
  };

  const handleAssign = (e, idx, value) => {
    let assignResult = [];
    if (e.target.checked === false) {
      assignResult = assign.filter((item) => item.id !== value.id);
    }
    if (e.target.checked === true) {
      assignResult = [...assign, value];
    }
    setAssign((prev) => (prev = assignResult));
  };

  const handleAllAssign = () => {
    setAssign(assignPoolFiltered);
  };

  const handleGamesCategory = (data) => {
    const dummy = [...gamesCategory];
    dummy.splice(pIndex, 1, data);
    const newData = [...dummy];
    return newData;
  };

  useMemo(() => {
    setAssignPoolFiltered(handleDENC(editCup.refereeAssign, "refUid"));
  }, []);

  useMemo(() => {
    setGameInfo(() => ({
      ...gameInfo,
      refereeAssign: [...assign],
    }));
  }, [assign]);

  useMemo(() => {
    setGameInfo(() => ({ ...gameInfo, launched: !classIsTrue }));
  }, [classIsTrue]);

  useMemo(() => {
    console.log(gameInfo);
    const gameNewData = handleGamesCategory(gameInfo);
    const cupData = { ...editCup, gamesCategory: [...gameNewData] };
    dispatch({ type: "EDIT", payload: { cupData } });
  }, [gameInfo]);

  const customList = (items) => {
    return (
      <div className="flex w-full h-72 overflow-auto flex-col">
        <div className="flex flex-col gap-y-2 w-full p-1">
          {items.length > 0 &&
            items.map((value, idx) => (
              <div className="flex h-13 w-full p-3 justify-center items-center border-0 border-gray-400 rounded-md bg-slate-800">
                <div className="flex items-center h-5 justify-center ">
                  <input
                    type="checkbox"
                    tabIndex={-1}
                    checked={assign.some((uid) => uid.refUid === value.refUid)}
                    onChange={(e) => handleAssign(e, idx, value)}
                    ref={(el) => (chkRef.current[idx] = el)}
                    id={`itemsRefereeCheckbox-${value.id}`}
                    className="w-4 h-4 bg-pink-100 border-pink-300 text-pink-500 focus:ring-red-200 border-0 rounded-lg focus:ring-0"
                  />
                </div>
                <div className="ml-2 text-md w-full h-full">
                  <label
                    id
                    htmlFor={`itemsRefereeCheckbox-${value.id}`}
                    className="font-medium text-gray-900 dark:text-gray-300 w-full h-full flex "
                  >
                    <div className="flex w-full items-center gap-x-3">
                      <div className="flex flex-col">
                        <p className=" text-sm text-gray-300">
                          {value.refName}
                        </p>
                        <span className=" text-xs text-gray-500">
                          {value.refEmail}
                        </span>
                        <span className=" text-xs text-gray-500">
                          {value.refTel}
                        </span>
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
      {gameInfo && (
        <div className="flex w-full h-full p-10 justify-between">
          <div className="flex flex-col w-5/12 bg-slate-900 rounded-lg p-3 gap-y-2">
            <div className="flex border-gray-400 rounded-md bg-slate-800 h-13">
              <div className="flex w-full h-full p-3 items-center">
                {classIsTrue ? (
                  <>
                    <p className="text-gray-600 font-semibold line-through">
                      {gameInfo.title || ""}
                    </p>
                    <span className="text-gray-400 text-sm ml-2 no-underline">
                      종목삭제됨
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-white font-semibold">
                      {gameInfo.title || ""}
                    </span>
                    <button
                      className="text-white text-xs ml-10"
                      onClick={() => {
                        console.log("first");
                        setGameInfo({ ...gameInfo, state: "진행중" });
                      }}
                    >
                      진행중으로변경
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="flex border-gray-400 rounded-md bg-slate-800 h-13">
              <div className="flex w-full h-full p-3 flex-wrap gap-1">
                {/* 체크박스 폼컨트롤 해야하나? */}
                {gameInfo.class &&
                  gameInfo.class.map((game, idx) => (
                    <div className="flex w-28 justify-start items-center gap-x-2">
                      <input
                        type="checkbox"
                        tabIndex={-1}
                        checked={game.launched}
                        onChange={() => handleChk(idx)}
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
            <div className="flex border-gray-400 rounded-md bg-slate-800 flex-col">
              <div className="flex p-3">
                <span className="text-white">배정된심판</span>
                {assign ? (
                  <span className="text-white ml-2">{`(${assign.length})`}</span>
                ) : (
                  <span className="text-white">0</span>
                )}
              </div>
              <div className="flex w-full h-full p-3 flex-wrap gap-2">
                {assign &&
                  assign.map((item, idx) => (
                    <div className="flex justify-center items-center w-18">
                      <span className="bg-blue-500 py-1 px-1 text-xs rounded-lg text-white font-semibold">
                        {item.refName}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div
            className="flex h-full justify-center items-center flex-col gap-y-3 w-2/12"
            style={{ minHeight: "370px" }}
          >
            <button className="text-white" onClick={() => handleAllAssign()}>
              {`<< 모두배정`}
            </button>
            <button className="text-white" onClick={() => setAssign([])}>
              {`모두제외>>`}
            </button>
          </div>
          <div
            className="flex flex-col w-5/12 bg-slate-900 rounded-lg p-3 gap-y-2"
            style={{ minHeight: "370px" }}
          >
            <div className="flex h-13 w-full p-3 justify-center items-center border-0 border-gray-400 rounded-md bg-slate-800">
              <div className="flex items-center h-5 justify-center w-full">
                <span>
                  <FontAwesomeIcon icon={faSearch} className="text-gray-200" />
                </span>
                <input
                  type="text"
                  name="refereeSearch"
                  id="refereeSearch"
                  onChange={(e) => {
                    e.preventDefault();
                    handleSearch(e.target.value);
                  }}
                  className=" bg-transparent border-0 text-white outline-none focus:ring-0 w-full"
                />
                {/* <button className="w-24 text-sm text-white">전체선택</button> */}
              </div>
            </div>
            {searchCount === 0 ? (
              <div className="flex h-13 w-full p-3 justify-center items-center border-0 border-gray-400 rounded-md bg-slate-800">
                <div className="flex items-center h-5 justify-center ">
                  <span className="text-white font-semibold text-sm">
                    적당한 검색결과 없음
                  </span>
                </div>
              </div>
            ) : (
              assignPoolFiltered.length > 0 && customList(assignPoolFiltered)
            )}
          </div>
        </div>
      )}
    </div>
  );
};
