import { pageTitle, widgetTitle } from "./Titles";
import PosterBg from "../assets/images//bg/posterBg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPenToSquare,
  faPeopleRoof,
  faPlusCircle,
  faScaleBalanced,
  faUsersLine,
} from "@fortawesome/free-solid-svg-icons";
import WidgetWithTable from "./WidgetWithTable";
import { getDocsData } from "../firebases/getDatas";
import { useState } from "react";
import { useEffect } from "react";

const REFEREE_HEADERS = ["ID", "이름", "지역"];
const RefereeTableDatas = (rows) => {
  let madeData = {};
  let rowsArray = [];

  try {
    const madeRows = rows.map((item, idx) => {
      rowsArray.push({
        id: item.basicInfo.refId,
        name: item.basicInfo.refName,
        location: item.basicInfo.refLocation,
      });
    });
  } catch (error) {
    console.log(error.message);
  } finally {
    return rowsArray;
  }
};

const IngCup = () => {
  const [resReferee, setResReferee] = useState([]);
  const [resRefereeTableData, setResRefereeTableData] = useState([]);
  const getRefereeData = async () => {
    try {
      await getDocsData({ documentName: "referee" }).then((res) =>
        setResReferee((prev) => (prev = res))
      );
    } catch (error) {
      console.log(error.message);
    } finally {
      if (resReferee.length > 0) {
        console.log("loading...");
      }
    }
  };

  useEffect(() => {
    getRefereeData();
  }, []);

  useEffect(() => {
    setResRefereeTableData(RefereeTableDatas(resReferee));
    //console.log(resRefereeTableData);
  }, [resReferee]);

  return (
    <div className="flex w-full h-full flex-col gap-y-8">
      <div className="flex w-full gap-x-8">
        <div
          className="flex w-1/3 justify-center p-5  rounded-lg"
          style={{ backgroundColor: "rgba(7,11,41,0.7" }}
        >
          <img
            src="https://img0.yna.co.kr/etc/inner/KR/2016/06/13/AKR20160613024900007_01_i_P4.jpg"
            className="w-60 rounded-2xl"
          />
        </div>
        <div
          className="flex w-2/3 flex-col px-10 py-8 gap-y-5 rounded-lg"
          style={{ backgroundColor: "rgba(7,11,41,0.7" }}
        >
          <div className="flex justify-start items-top mb-5 gap-x-5">
            <span className="text-white font-extrabold text-4xl">
              경기용인보디빌딩대회 13회
            </span>
            <div className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl">
              <FontAwesomeIcon
                icon={faPenToSquare}
                className="text-white text-lg"
              />
            </div>
          </div>

          <div className="flex justify-start items-top">
            <span className="text-white text-xl">
              대회명 : 경기용인보디빌딩대회
            </span>
          </div>
          <div className="flex justify-start items-top">
            <span className="text-white text-xl">회차 : 13회</span>
          </div>
          <div className="flex justify-start items-top">
            <span className="text-white text-xl">
              주최 : 경기용인보디빌딩협회
            </span>
          </div>
          <div className="flex justify-start items-top">
            <span className="text-white text-xl">장소 : 용인시청 대경기장</span>
          </div>
          <div className="flex justify-start items-top">
            <span className="text-white text-xl">일자 : 2022-11-01</span>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-x-8 ">
        <div className="flex w-1/2 h-96">
          <WidgetWithTable
            data={{
              title: "심판",
              titleIcon: faScaleBalanced,
              tableHeaders: REFEREE_HEADERS,
              tableData: resRefereeTableData,
            }}
          />
        </div>
        <div
          className="flex w-1/2 h-96 p-8 rounded-lg flex-col align-top justify-start gap-y-3"
          style={{ backgroundColor: "rgba(7,11,41,0.6" }}
        >
          <div className="flex items-center justify-start bg-slate-800 w-full h-14 rounded-xl px-5 gap-x-2">
            <div className="flex justify-between w-full">
              <div className="flex justify-center items-center">
                <FontAwesomeIcon
                  icon={faUsersLine}
                  className="text-white text-xl mr-2"
                />
                <span className="text-white text-xl ">참가선수</span>
              </div>

              <div className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl">
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="text-white text-lg"
                />
              </div>
            </div>
          </div>
          <div className="flex items-start justify-start w-full h-64 rounded-xl gap-x-2 flex-wrap overflow-y-auto">
            <div className="flex w-full justify-center rounded-lg ">
              {/* <span className="text-white text-lg">
                현재 참가 등록한 선수가 없습니다.
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngCup;
