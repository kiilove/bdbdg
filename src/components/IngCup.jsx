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

const IngCup = () => {
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
        <div
          className="flex w-1/2 h-96 p-8 rounded-lg flex-col align-top justify-start gap-y-3"
          style={{ backgroundColor: "rgba(7,11,41,0.6" }}
        >
          <div className="flex items-center justify-start bg-slate-800 w-full h-14 rounded-xl px-5 gap-x-2">
            <div className="flex justify-between w-full">
              <div className="flex justify-center items-center">
                <FontAwesomeIcon
                  icon={faScaleBalanced}
                  className="text-white text-xl mr-2"
                />
                <span className="text-white text-xl ">심판</span>
              </div>

              <div className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl">
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="text-white text-lg"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-start  w-full h-64 rounded-xl  gap-x-2 flex-wrap overflow-y-auto">
            <div className="flex w-full justify-center rounded-lg ">
              <span className="text-white text-lg">
                현재 배정된 심판이 없습니다.
              </span>
            </div>
          </div>
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
              <div className="flex w-full">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                    <tr>
                      <th className="py-3 px-6">id</th>
                      <th className="py-3 px-6">이름</th>
                      <th className="py-3 px-6">지역</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className=" border-b border-gray-700">
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        1
                      </td>
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        김진배
                      </td>
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        서울
                      </td>
                    </tr>
                    <tr className=" border-b border-gray-700">
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        1
                      </td>
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        김진배
                      </td>
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        서울
                      </td>
                    </tr>
                    <tr className=" border-b border-gray-700">
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        1
                      </td>
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        김진배
                      </td>
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        서울
                      </td>
                    </tr>
                    <tr className=" border-b border-gray-700">
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        1
                      </td>
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        김진배
                      </td>
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        서울
                      </td>
                    </tr>
                    <tr className=" border-b border-gray-700">
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        1
                      </td>
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        김진배
                      </td>
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        서울
                      </td>
                    </tr>
                    <tr className=" border-b border-gray-700">
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        1
                      </td>
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        김진배
                      </td>
                      <td className="text-white text-sm font-semibold py-3 px-6">
                        서울
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngCup;
