import React, { useState } from "react";
import { faSave, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formTitle, widgetTitle } from "./Titles";
import { useEffect } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import { async } from "@firebase/util";
import { OutlineButton } from "../assets/forms/button";
const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-1";

const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white focus:ring-0";

const saveButton = () => (
  <div
    id="menuItemIconBox"
    className="flex w-20 h-10 justify-center items-center rounded-xl bg-slate-800 hover:bg-sky-500 hover:cursor-pointer"
  >
    <FontAwesomeIcon
      icon={faSave}
      className="text-xl text-white font-extrabold"
    />
  </div>
);

const makeFileName = (filename, salt) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prevFilename = filename.split(".");
  return String(salt).toUpperCase() + currentTime + "." + prevFilename[1];
};

const uploadImage = (e, state) => {
  let uploadURL = "";
  const imageFile = e.target.files[0];
  const imageFileName = e.target.files[0].name;
  const newFileName = makeFileName(imageFileName, "p");

  const storageRef = ref(storage, `images/poster/${newFileName}`);
  const uploadTask = uploadBytesResumable(storageRef, imageFile);
  try {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          state(downloadURL);
        });
      }
    );
  } catch (error) {
    console.log(error.message);
  } finally {
    console.log("UPLOAD", uploadURL);
  }
};

export const NewPlayer = () => {};
export const Startpage = () => {
  return (
    <div
      className="flex w-full h-full bg-transparent flex-col"
      style={{ minWidth: "800px" }}
    >
      <div className="flex w-full flex-col p-10  h-32">
        <div className="flex w-full">
          <h1 className="text-white text-2xl font-extrabold w-full text-center align-middle">
            새로운 대회를 준비합니다.
          </h1>
        </div>
      </div>
    </div>
  );
};

export const NewGame = () => {
  return (
    <div
      className="flex w-full h-full bg-transparent flex-col"
      style={{ minWidth: "800px" }}
    >
      <div className="flex w-full">{formTitle({ title: "종목명" })}</div>
      <div className={inputBoxStyle}>
        <input type="text" className={inputTextStyle} />
      </div>
      <div className="flex w-full">
        {formTitle({ title: "필요한 심판 인원수" })}
      </div>
      <div className={inputBoxStyle} style={{ width: "50px" }}>
        <input type="text" className={inputTextStyle} maxLength="3" />
      </div>
    </div>
  );
};

export const SelectReferees = ({ poolData, assignData, setRefereeAssign }) => {
  const [checked, setChecked] = useState([]);
  const [pool, setPool] = useState(poolData);
  const [assign, setAssign] = useState(assignData);

  const poolChecked = intersection(checked, pool);
  const assignChecked = intersection(checked, assign);

  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a, b) {
    //console.log(a);
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    //console.log(checked);
  };

  const handleAllAssign = () => {
    setAssign(assign.concat(pool));
    setPool([]);
  };

  const handleCheckedAssign = () => {
    setAssign(assign.concat(poolChecked));
    setPool(not(pool, poolChecked));
    setChecked(not(checked, poolChecked));
    //console.log(assign);
  };

  const handleCheckedPool = () => {
    setPool(pool.concat(assignChecked));
    setAssign(not(assign, assignChecked));
    setChecked(not(checked, assignChecked));
    //console.log(pool);
  };

  const handleAllPool = () => {
    setPool(pool.concat(assign));
    setAssign([]);
  };

  useEffect(() => {
    setRefereeAssign(assign);
  }, [assign]);

  const customList = (items) => {
    //console.log(items[0]);
    return (
      <div className="flex w-full h-72 overflow-auto">
        <div className="flex flex-col gap-y-2 w-full p-1">
          {items.map((value, idx) => (
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
                        {value.basicInfo.refName} [{value.id}]
                      </p>
                      <span className=" text-xs text-gray-500">
                        {value.basicInfo.refEmail}
                      </span>
                      <span className=" text-xs text-gray-500">
                        {value.basicInfo.refTel}
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
            <div className="flex rounded-lg p-3">
              <span className="text-white font-semibold">
                전체목록({pool && pool.length})
              </span>
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
              {pool ? customList(assign) : <div></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SelectPlayers = ({ poolData, assignData, setPlayerAssign }) => {
  const [checked, setChecked] = useState([]);
  const [pool, setPool] = useState(poolData);
  const [assign, setAssign] = useState(assignData);

  const poolChecked = intersection(checked, pool);
  const assignChecked = intersection(checked, assign);

  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a, b) {
    //console.log(a);
    return a.filter((value) => b.indexOf(value) !== -1);
  }
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    //console.log(checked);
  };

  const handleAllAssign = () => {
    setAssign(assign.concat(pool));
    setPool([]);
  };

  const handleCheckedAssign = () => {
    setAssign(assign.concat(poolChecked));
    setPool(not(pool, poolChecked));
    setChecked(not(checked, poolChecked));
    //console.log(assign);
  };

  const handleCheckedPool = () => {
    setPool(pool.concat(assignChecked));
    setAssign(not(assign, assignChecked));
    setChecked(not(checked, assignChecked));
    //console.log(pool);
  };

  const handleAllPool = () => {
    setPool(pool.concat(assign));
    setAssign([]);
  };

  useEffect(() => {
    setPlayerAssign(assign);
  }, [assign]);

  const customList = (items) => {
    //console.log(items[0]);
    return (
      <div className="flex w-full h-72 overflow-auto">
        <div className="flex flex-col gap-y-2 w-full p-1">
          {items.map((value, idx) => (
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
                        {value.basicInfo.playerName} [{value.id}]
                      </p>
                      <span className=" text-xs text-gray-500">
                        {value.basicInfo.playerEmail}
                      </span>
                      <span className=" text-xs text-gray-500">
                        {value.basicInfo.playerTel}
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
            <div className="flex rounded-lg p-3">
              <span className="text-white font-semibold">
                전체목록({pool && pool.length})
              </span>
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
              {pool ? customList(assign) : <div></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
