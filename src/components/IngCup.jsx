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

const REFEREE_HEADERS = ["ID", "이름", "이메일"];
const PLAYER_HEADERS = ["ID", "이름", "이메일"];

const makeTableDatas = (rows, props) => {
  let madeData = {};
  let rowsArray = [];
  let madeRows = [];

  if (props.documentName === "referee") {
    madeRows = rows.map((item, idx) => {
      rowsArray.push([
        item.basicInfo.refId,
        item.basicInfo.refName,
        item.basicInfo.refEmail,
      ]);
    });
  } else if (props.documentName === "player") {
    madeRows = rows.map((item, idx) => {
      rowsArray.push([
        item.basicInfo.playerId,
        item.basicInfo.playerName,
        item.basicInfo.playerEmail,
      ]);
    });
  }
  console.log("makeTableDatas finished");
  return rowsArray;
};

const IngCup = () => {
  const [resReferee, setResReferee] = useState([]);
  const [resRefereeTableData, setResRefereeTableData] = useState([]);
  const [resPlayer, setResPlayer] = useState([]);
  const [resPlayerTableData, setResPlayerTableData] = useState([]);

  // 22-11-09 여기부분 다시 작성해야함 만들다 말았음
  // 첫번째 then 이후에 switch문으로 props.documentName별 state 변경하고
  // finally에서 madeRow 함수 실행시켜볼까 하고 있었음.
  // 22-11-10 코드 재사용 성공 했으나 DOM문제로 UserEffect를 사용하기로 변경했음
  const getDatas = async (props) => {
    try {
      await getDocsData({ documentName: props.documentName }).then((res) => {
        switch (props.documentName) {
          case "referee":
            setResReferee((prev) => (prev = res));
          case "player":
            setResPlayer((prev) => (prev = res));
          default:
            break;
        }
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      console.log("getDatas Finished");
    }
  };

  useEffect(() => {
    getDatas({ documentName: "referee" });
    getDatas({ documentName: "player" });
  }, []);

  useEffect(() => {
    setResRefereeTableData(
      makeTableDatas(resReferee, { documentName: "referee" })
    );
    setResPlayerTableData(
      makeTableDatas(resPlayer, { documentName: "player" })
    );
  }, [resReferee, resPlayer]);

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
        <div className="flex w-1/2 h-96">
          <WidgetWithTable
            data={{
              title: "출전선수",
              titleIcon: faScaleBalanced,
              tableHeaders: PLAYER_HEADERS,
              tableData: resPlayerTableData,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default IngCup;
