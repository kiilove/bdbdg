import dayjs from "dayjs";
import React, { useContext, useEffect, useMemo } from "react";
import { useState } from "react";
import { DEFAULT_CUP_POSTER } from "../const/front";
import { EditcupContext } from "../context/EditcupContext";
import useFirebaseStorage from "../customhooks/useFirebaseStorage";
import "dayjs/locale/ko";

const CupInfo = (renderMode) => {
  const { editCup } = useContext(EditcupContext);
  const [isEditMode, setIsEditMode] = useState(true);
  const [titlePoster, setTitlePoster] = useState(DEFAULT_CUP_POSTER);
  const [files, setFiles] = useState([]);
  const [getCupInfo, setGetCupInfo] = useState({ ...editCup.cupInfo });

  const { progress, urls, errors, representativeImage } = useFirebaseStorage(
    files,
    "images/poster"
  );
  dayjs.locale("ko");
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  useMemo(() => {
    if (urls.length > 0) {
      console.log(urls);
      console.log(representativeImage);
      setFiles([]);
    }
  }, [urls]);

  useMemo(() => {
    if (Object.keys(getCupInfo).lenght === 0) {
      return;
    }
    console.log(getCupInfo);
  }, [getCupInfo]);

  useEffect(() => {
    setGetCupInfo({ ...editCup.cupInfo });
    return () => {
      setGetCupInfo({});
    };
  }, [editCup.cupInfo]);

  return (
    <div
      className="w-full h-full relative rounded-lg p-2"
      style={{ minHeight: "700px" }}
    >
      <img
        src={titlePoster}
        alt="Movie poster"
        className="h-full w-full object-cover object-top top-0 absolute left-0 rounded-lg"
      />
      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-gray-900 to-transparent rounded-lg" />
      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-gray-900 to-transparent  rounded-lg" />
      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-gray-900 to-transparent  rounded-lg" />
      <div className="absolute bottom-0 text-white py-6 px-4 flex justify-center items-start flex-col w-full">
        <div className="flex w-full justify-start items-center">
          <input
            type="text"
            className="text-3xl font-bold mb-2 w-full bg-transparent border-0 placeholder:text-white text-left"
            value={getCupInfo.cupName}
            placeholder="대회명"
          />
          <input
            type="text"
            className="text-3xl font-bold mb-2 bg-transparent border-0 w-24 placeholder:text-white text-left"
            // value={getCupInfo.cupCount}
            placeholder="회차"
          />
        </div>
        <div className="flex w-full justify-start items-left">
          <input
            type="text"
            className="text-base border-0 placeholder:text-white text-left bg-transparent focus:text-center"
            placeholder="대회일자"
            value={dayjs(getCupInfo.cupDate.startDate).format("YYYY-MM-DD")}
          />
          {/* <p>{dayjs(getCupInfo.cupDate.startDate).format("dddd")}</p> */}
        </div>
      </div>
    </div>
  );
};

export default CupInfo;
