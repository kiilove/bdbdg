import { pageTitle, widgetTitle } from "../components/Titles";
import PosterBg from "../assets/images//bg/posterBg.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPenToSquare,
  faPeopleLine,
  faPeopleRoof,
  faPlus,
  faPlusCircle,
  faScaleBalanced,
  faSitemap,
  faTimes,
  faUsersLine,
} from "@fortawesome/free-solid-svg-icons";
import WidgetWithTable from "../components/WidgetWithTable";
import { getDocsData } from "../firebases/getDatas";
import { useState } from "react";
import { useEffect } from "react";
import WidgetWithTableDragable from "../components/WidgetWithTableDragable";
import {
  NewCup,
  NewGame,
  TransferPlayer,
  TransferReferee,
} from "../components/Modals";
import { Modal } from "@mui/material";

const REFEREE_HEADERS = ["ID", "이름", "이메일"];
const PLAYER_HEADERS = ["ID", "이름", "이메일"];
const GAME_HEADERS = [
  "경기순서",
  "종목명",
  "필요 심판 / 배정된 심판",
  "필요 선수 / 배정된 선수",
  "체점표 준비",
  "준비율",
];

const tempGameData = [
  [
    "1",
    "171cm 남자클래식",
    "9 / 5",
    "10 / 4",
    "준비중",
    "50%",
    <FontAwesomeIcon icon={faPenToSquare} className="text-white text-lg" />,
  ],
  [
    "2",
    "181cm 남자클래식",
    "9 / 8",
    "10 / 8",
    "완료",
    "90%",
    <FontAwesomeIcon icon={faPenToSquare} className="text-white text-lg" />,
  ],
  [
    "3",
    "160cm 여자클래식",
    "9 / 5",
    "10 / 4",
    "준비중",
    "50%",
    <FontAwesomeIcon icon={faPenToSquare} className="text-white text-lg" />,
  ],
  [
    "4",
    "170cm 여자스포츠",
    "9 / 8",
    "10 / 8",
    "완료",
    "90%",
    <FontAwesomeIcon icon={faPenToSquare} className="text-white text-lg" />,
  ],
];

const makeTableDatas = (rows, props) => {
  let madeData = {};
  let rowsArray = [];
  let madeRows = [];

  if (props.collectionName === "referee") {
    madeRows = rows.map((item, idx) => {
      rowsArray.push([
        item.basicInfo.refId,
        item.basicInfo.refName,
        item.basicInfo.refEmail,
      ]);
    });
  } else if (props.collectionName === "player") {
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
  const [cupId, setCupId] = useState();
  const [resReferee, setResReferee] = useState([]);
  const [resRefereeTableData, setResRefereeTableData] = useState([]);
  const [resPlayer, setResPlayer] = useState([]);
  const [resPlayerTableData, setResPlayerTableData] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState();

  const handleOpenModal = ({ component }) => {
    console.log(component);
    setModalComponent(() => component);
    setModal(() => true);
  };

  const handleCloseModal = () => {
    setModalComponent("");
    setModal(() => false);
  };

  // 22-11-09 여기부분 다시 작성해야함 만들다 말았음
  // 첫번째 then 이후에 switch문으로 props.documentName별 state 변경하고
  // finally에서 madeRow 함수 실행시켜볼까 하고 있었음.
  // 22-11-10 코드 재사용 성공 했으나 DOM문제로 UserEffect를 사용하기로 변경했음
  const getDatas = async (props) => {
    try {
      await getDocsData({ collectionName: props.collectionName }).then(
        (res) => {
          switch (props.collectionName) {
            case "referee":
              setResReferee((prev) => (prev = res));
            case "player":
              setResPlayer((prev) => (prev = res));
            default:
              break;
          }
        }
      );
    } catch (error) {
      console.log(error.message);
    } finally {
      console.log("getDatas Finished");
    }
  };

  useEffect(() => {
    getDatas({ collectionName: "referee" });
    getDatas({ collectionName: "player" });
  }, []);

  useEffect(() => {
    setResRefereeTableData(
      makeTableDatas(resReferee, { collectionName: "referee" })
    );
    setResPlayerTableData(
      makeTableDatas(resPlayer, { collectionName: "player" })
    );
  }, [resReferee, resPlayer]);

  return (
    <div className="flex w-full h-full flex-col gap-y-8">
      <Modal open={modal} onClose={handleCloseModal}>
        <div
          className="absolute top-1/2 left-1/2 border-0 px-10 py-3 outline-none rounded-lg flex flex-col"
          style={{
            backgroundColor: "rgba(7,11,41,0.9)",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Modal창을 닫기 위해 제목을 부모창에서 열도록 설계했음 */}
          <div className="flex w-full">
            <div className="flex w-1/2">
              {widgetTitle({ title: "대회 정보 수정" })}
            </div>
            <div
              className="flex w-1/2 justify-end items-center hover:cursor-pointer"
              onClick={() => handleCloseModal()}
            >
              <FontAwesomeIcon
                icon={faTimes}
                className="text-white text-2xl font-bold"
              />
            </div>
          </div>
          {modalComponent}
        </div>
      </Modal>
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
            <div
              className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl hover:cursor-pointer"
              onClick={() => handleOpenModal({ component: <NewCup /> })}
            >
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
              title: "참가심판",
              titleIcon: faScaleBalanced,
              tableHeaders: REFEREE_HEADERS,
              tableData: resRefereeTableData,
              modalComponent: "",
            }}
          />
        </div>
        <div className="flex w-1/2 h-96">
          <WidgetWithTable
            data={{
              title: "출전선수",
              titleIcon: faPeopleLine,
              tableHeaders: PLAYER_HEADERS,
              tableData: resPlayerTableData,
              modalComponent: "",
            }}
          />
        </div>
      </div>
      <div className="flex w-full h-96">
        <WidgetWithTableDragable
          data={{
            title: "개최종목",
            titleIcon: faSitemap,
            actionIcon: faPlus,
            actionComponent: <NewGame />,
            tableHeaders: GAME_HEADERS,
            tableData: tempGameData,
          }}
        />
      </div>
    </div>
  );
};

export default IngCup;
