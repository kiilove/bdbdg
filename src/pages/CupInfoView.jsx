import dayjs from "dayjs";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import useFirestore from "../customhooks/useFirestore";
import Loading from "./Loading";
import html2canvas from "html2canvas";
import { EditcupContext } from "../context/EditcupContext";

const CupInfoView = ({ cupId }) => {
  console.log(cupId);
  const [cupInfo, setCupInfo] = useState({});
  const [posterTitle, setPosterTitle] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const { state, dispatch } = useContext(EditcupContext);
  const params = useParams();
  const qrCodeRef = useRef(null);

  const {
    data: getCupInfoData,
    error: cupInfoError,
    getDocument: cupGetDocument,
  } = useFirestore();

  const handlePosterTitle = (posters) => {
    if (posters !== undefined && posters.length) {
      const posterTitle = posters.filter((item) => item.title === true);

      if (posterTitle === undefined || posterTitle.length === 0) {
        return null;
      } else {
        return posterTitle[0].link;
      }
    } else {
      return null;
    }
  };

  const getCupInfo = useMemo(() => {
    console.log(getCupInfoData);
    if (!getCupInfoData) {
      return;
    }
    dispatch({ type: "EDIT", payload: { cupData: { ...getCupInfoData } } });
    setIsLoading(false);
    return getCupInfoData.cupInfo;
  }, [getCupInfoData]);
  useEffect(() => {
    if (params !== null) {
      cupGetDocument("cups", params.cupId);
    }
  }, []);

  return (
    <div className="flex w-full h-full flex-col gap-y-5">
      {isLoading && <Loading />}
      {getCupInfo && (
        <div className="flex w-full h-full flex-col gap-y-5">
          <div className="flex w-full gap-x-5">
            <div
              className="flex justify-center p-3  rounded-lg w-1/3"
              style={{ backgroundColor: "rgba(7,11,41,0.7" }}
            >
              {handlePosterTitle(getCupInfoData.cupInfo.cupPoster) !== null && (
                <img
                  src={
                    getCupInfoData &&
                    handlePosterTitle(getCupInfoData.cupInfo.cupPoster)
                  }
                  className=" rounded-lg object-cover object-top"
                  style={{ minWidth: "300px", width: "100%" }}
                />
              )}
            </div>
            <div
              className="flex justify-start w-1/3 p-3 gap-y-5 rounded-lg flex-col"
              style={{ backgroundColor: "rgba(7,11,41,0.7" }}
            >
              <div className="flex w-full h-12 bg-gray-900 justify-end items-center">
                <button className="bg-gray-900 border px-3 py-2 h-10">
                  <span className="text-white">대회정보수정</span>
                </button>
              </div>
              <div className="flex flex-col w-full h-full px-5 gap-y-5 font-semibold md: text-lg">
                <div className="flex justify-start items-top ">
                  <span className="text-white text-base">
                    대회명 : {getCupInfo.cupName}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-base">
                    회차 : {getCupInfo.cupCount}회
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-base">
                    주관 : {getCupInfo.cupAgency ? getCupInfo.cupAgency : ""}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-base">
                    주최 : {getCupInfo.cupOrg}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-base">
                    대회장소 : {getCupInfo.cupLocation}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-base">
                    대회장주소 :{" "}
                    {getCupInfo.cupLocationAddr
                      ? getCupInfo.cupLocationAddr
                      : ""}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-base">
                    일자 :{" "}
                    {getCupInfo.cupDate.startDate === undefined ||
                    getCupInfo.cupDate === undefined
                      ? "미정"
                      : dayjs(getCupInfo.cupDate.startDate).format(
                          "YYYY-MM-DD"
                        )}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-base">
                    참가비 :{" "}
                    {getCupInfo.cupFee.basicFee
                      ? parseInt(getCupInfo.cupFee.basicFee).toLocaleString() +
                        " 원"
                      : ""}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-base">
                    중복참가비 :{" "}
                    {getCupInfo.cupFee.extraFee
                      ? parseInt(getCupInfo.cupFee.extraFee).toLocaleString() +
                        " 원"
                      : ""}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-base">
                    중복참가비 부과방식 : {getCupInfo.cupFee.extraType}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-base">
                    상태 : {getCupInfo.cupState}
                  </span>
                </div>
                <div className="flex justify-start items-top">
                  <span className="text-white text-base">
                    알림사항 :{" "}
                    {getCupInfo.cupNotice ? getCupInfo.cupNotice : ""}
                  </span>
                </div>
              </div>
            </div>
            <div
              className="flex justify-start w-1/3 p-3 gap-y-5 rounded-lg flex-col"
              style={{ backgroundColor: "rgba(7,11,41,0.7" }}
            >
              <div className="flex w-full h-12 bg-gray-900 justify-end items-center gap-x-2">
                <button className="bg-gray-900 border px-3 py-2 h-10">
                  <span className="text-white">QR코드다운로드</span>
                </button>
                <button className="bg-gray-900 border px-3 py-2 h-10">
                  <span className="text-white">QR코드변경</span>
                </button>
              </div>
              <div className="flex p-10 ">
                <div className="flex w-full bg-white p-10">
                  <QRCode
                    size={100}
                    className="w-full h-full"
                    ref={qrCodeRef}
                    value={"https://bdbdg-player.web.app"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CupInfoView;
