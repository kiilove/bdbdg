import { useEffect } from "react";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { formTitle, widgetTitle } from "../components/Titles";

const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-1";

const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white focus:ring-0";

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

const makeFileName = (filename, salt) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prevFilename = filename.split(".");
  return String(salt).toUpperCase() + currentTime + "." + prevFilename[1];
};

export const NewCupInfo = ({ prevState, prevInfo }) => {
  const [cupInfo, setCupInfo] = useState({ ...prevInfo });
  const [uploadedImageURL, setUploadedImageURL] = useState();
  //console.log(props.cupInfo);
  const handleCupInfo = (e) => {
    if (e.target.name !== "cupPoster") {
      setCupInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  useEffect(() => {
    prevState({ ...cupInfo });
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
              {uploadedImageURL ? (
                <div className="flex flex-col justify-center items-center">
                  <img src={uploadedImageURL} alt="" className=" object-fill" />
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
                    {prevInfo.cupPoster && prevInfo.cupPoster}
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
      </div>
    </div>
  );
};
