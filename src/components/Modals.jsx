import React, { useState } from "react";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formTitle, widgetTitle } from "./Titles";
import { useEffect } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-1";

const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white";

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

const uploadImage = (e) => {
  const imageFile = e.target.files[0];
  const imageFileName = e.target.files[0].name;
  console.log(imageFileName);
  const storageRef = ref(storage, `images/poster/${imageFileName}`);
  const uploadTask = uploadBytesResumable(storageRef, imageFile);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        console.log("File available at", downloadURL);
      });
    }
  );
};

export const NewCup = (props) => {
  const [cupInfo, setCupInfo] = useState({});

  const handleCupInfo = (e) => {
    if (e.target.name !== "cupPoster") {
      setCupInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    } else {
      setCupInfo((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
    }
  };

  useEffect(() => {
    console.log(cupInfo);
  }, [cupInfo]);

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border"
      style={{ minWidth: "800px", maxWidth: "1000px" }}
    >
      <div className="flex w-1/3 flex-col">
        <div className="flex justify-center items-start mt-3">
          <div className="flex justify-center items-center w-full">
            <label
              for="cupPoster"
              className="flex flex-col justify-center items-center w-full h-96 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer  hover:bg-blue-800"
            >
              <div className="flex flex-col justify-center items-center">
                <p className="mb-2 text-sm text-white">대회 포스터 </p>
              </div>
              <input
                type="file"
                id="cupPoster"
                name="cupPoster"
                className="hidden"
                // onChange={(e) => setImageFiles([e.target.files[0]])}
                onChange={(e) => uploadImage(e)}
              />
            </label>
          </div>
        </div>
        <div></div>
      </div>
      <div className="flex w-2/3 h-full flex-col flex-wrap box-border">
        <div className="flex w-full">{formTitle({ title: "대회명" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="cupName"
            id="cupName"
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
export const TransferReferee = () => {};
export const TransferPlayer = () => {};
