import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useContext, useMemo, useState } from "react";
import { OutlineButton } from "../assets/forms/button";
import { Decrypter } from "../components/Encrypto";
import { EditcupContext } from "../context/EditcupContext";
import { db } from "../firebase";

const EditAssignReferees = () => {
  const [checked, setChecked] = useState([]);
  const [pool, setPool] = useState([]);
  const [assign, setAssign] = useState([]);

  const { dispatch, editCup } = useContext(EditcupContext);

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

  useMemo(() => {
    setPool(() => editCup.refereePool || []);
    setAssign(() => editCup.refereeAssign || []);
    //console.log(editCup.refereeAssign);
  }, []);

  useMemo(() => {
    dispatch({
      type: "EDIT",
      payload: {
        cupData: {
          ...editCup,
          cupInfo: { ...editCup.cupInfo },
          refereePool: [...pool] || [],
          refereeAssign: [...assign] || [],
        },
      },
    });
  }, [assign, pool]);

  const poolChecked = intersection(checked, pool);
  const assignChecked = intersection(checked, assign);

  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }
  function not2(a, b) {
    return a.filter((value) => b.indexOf(value.id) === -1);
  }

  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  const handlePoolRefresh = async () => {
    const poolAll = await getRefereePool();
    const poolResult = poolAll.filter((item) => {
      return !assign.some((other) => other.id === item.id);
    });

    setPool(poolResult);
  };
  const handleToggle = (value) => () => {
    //console.log(value);
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllAssign = () => {
    setAssign(assign.concat(pool));
    setPool([]);
  };

  const handleCheckedAssign = () => {
    setAssign(assign.concat(poolChecked));
    setPool(not(pool, poolChecked));
    setChecked(not(checked, poolChecked));
  };

  const handleCheckedPool = () => {
    setPool(pool.concat(assignChecked));
    setAssign(not(assign, assignChecked));
    setChecked(not(checked, assignChecked));
  };

  const handleAllPool = () => {
    setPool(pool.concat(assign));
    setAssign([]);
  };

  const customList = (items) => {
    return (
      <div className="flex w-full h-72 overflow-auto">
        <div className="flex flex-col gap-y-2 w-full p-1">
          {items.length > 0 &&
            items.map((value, idx) => (
              <div
                className={`flex h-13 w-full p-3 justify-center items-center border-0 border-gray-400 rounded-md bg-slate-800  ${
                  checked.indexOf(value) !== -1 && " border-sky-700 "
                }`}
              >
                <div className="flex items-center h-5 justify-center ">
                  <input
                    type="checkbox"
                    tabIndex={-1}
                    checked={checked.indexOf(value) !== -1}
                    id={`itemsRefereeCheckbox-${value.id}`}
                    onClick={handleToggle(value)}
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
                          {Decrypter(value.refName)}
                        </p>
                        <span className=" text-xs text-gray-500">
                          {Decrypter(value.refEmail)}
                        </span>
                        <span className=" text-xs text-gray-500">
                          {Decrypter(value.refTel)}
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
      <div className="flex w-full">
        <div className="flex w-full py-5">
          <div className="flex flex-col w-5/12 bg-slate-900 rounded-lg p-2 gap-y-2">
            <div className="flex rounded-lg p-3 items-center">
              <span className="text-white font-semibold">
                전체목록({pool && pool.length})
              </span>
              <button
                className="ml-3 text-gray-700 hover:text-white"
                onClick={() => handlePoolRefresh()}
              >
                <span className=" font-semibold ">
                  <FontAwesomeIcon icon={faRefresh} />
                </span>
              </button>
            </div>
            <div className="flex w-full justify-start  rounded-lg p-3">
              {pool ? customList(pool) : <div></div>}
            </div>
          </div>
          <div className="flex flex-col w-2/12 justify-center items-center gap-y-3 p-y-10">
            <button
              type="button"
              onClick={handleAllAssign}
              className={OutlineButton({
                type: "default",
                extra: "w-20",
              })}
            >
              {">>"}
            </button>
            <button
              type="button"
              onClick={handleCheckedAssign}
              className={OutlineButton({ type: "default", extra: "w-20" })}
            >
              {">"}
            </button>
            <button
              type="button"
              onClick={handleCheckedPool}
              className={OutlineButton({ type: "default", extra: "w-20" })}
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={handleAllPool}
              className={OutlineButton({ type: "default", extra: "w-20" })}
            >
              {"<<"}
            </button>
          </div>
          <div className="flex flex-col w-5/12 bg-slate-900 rounded-lg p-2 gap-y-2">
            <div className="flex rounded-lg p-3">
              <span className="text-white font-semibold">배정됨</span>
            </div>
            <div className="flex w-full justify-start  rounded-lg p-3">
              {assign ? customList(assign) : <div></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAssignReferees;
