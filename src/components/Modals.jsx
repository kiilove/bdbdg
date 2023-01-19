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

export const NewCup = (props) => {
  const [cupInfo, setCupInfo] = useState(props.cupInfo);
  const [uploadedImageURL, setUploadedImageURL] = useState(
    props.cupInfo.cupPoster
  );
  //console.log(props.cupInfo);
  const handleCupInfo = (e) => {
    if (e.target.name !== "cupPoster") {
      setCupInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  useEffect(() => {
    props.setCupInfo((prev) => (prev = cupInfo));
  }, [cupInfo]);

  useEffect(() => {
    setCupInfo((prev) => ({ ...prev, cupPoster: uploadedImageURL }));
  }, [uploadedImageURL]);

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border"
      style={{ minWidth: "800px", maxWidth: "1000px" }}
    >
      <div className="flex w-1/3 flex-col">
        <div className="flex justify-center items-start mt-3">
          {/* 이미지 업로드 폼 시작 */}
          <div className="flex justify-center items-center w-full">
            <label
              for="cupPoster"
              className="flex flex-col justify-center items-center w-full  rounded-lg border-2 border-gray-300 border-dashed cursor-pointer p-1  hover:bg-blue-800"
            >
              {uploadedImageURL || props.cupInfo.cupPoster ? (
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={props.cupInfo.cupPoster}
                    alt=""
                    className=" object-fill"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center h-32">
                  <svg
                    aria-hidden="true"
                    class="mb-3 w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-white font-bold">
                    {props.cupInfo.cupPoster && props.cupInfo.cupPoster}
                  </p>
                  <p className="text-xs text-gray-200 font-light">
                    SVG, PNG, JPG
                  </p>
                </div>
              )}

              <input
                type="file"
                id="cupPoster"
                name="cupPoster"
                className="hidden"
                // onChange={(e) => setImageFiles([e.target.files[0]])}
                onChange={(e) => uploadImage(e, setUploadedImageURL)}
              />
            </label>
          </div>
          {/* 이미지 업로드 폼 끝 */}
        </div>
      </div>
      <div className="flex w-2/3 h-full flex-col flex-wrap box-border">
        <div className="flex w-full">{formTitle({ title: "대회명" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="cupName"
            id="cupName"
            value={cupInfo.cupName}
            onChange={(e) => handleCupInfo(e)}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full">{formTitle({ title: "회차" })}</div>
        <div className={inputBoxStyle} style={{ width: "75px" }}>
          <input
            type="text"
            maxLength="3"
            name="cupCount"
            id="cupCount"
            value={cupInfo.cupCount}
            onChange={(e) => handleCupInfo(e)}
            className={inputTextStyle}
          />
          <span className="text-white flex justify-center items-center mr-2 text-sm">
            회
          </span>
        </div>
        <div className="flex w-full">{formTitle({ title: "주최기관" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="cupOrg"
            id="cupOrg"
            value={cupInfo.cupOrg}
            onChange={(e) => handleCupInfo(e)}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full">{formTitle({ title: "장소" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="cupLocation"
            id="cupLocation"
            value={cupInfo.cupLocation}
            onChange={(e) => handleCupInfo(e)}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full">{formTitle({ title: "일자" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="cupDate"
            id="cupDate"
            value={cupInfo.cupDate}
            onChange={(e) => handleCupInfo(e)}
            className={inputTextStyle}
          />
        </div>

        <div
          className={`flex w-full my-5 justify-end ${
            props.isPage && "hidden"
          } }`}
        >
          {saveButton()}
        </div>
      </div>
    </div>
  );
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
