import {
  faBell,
  faCircleUser,
  faGaugeHigh,
  faGear,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { pageTitle } from "./Titles";

const TopMenus = () => {
  return (
    <div
      id="topContainer"
      className="flex w-full rounded-lg  bg-white px-10 border border-gray-900"
      style={{ height: "70px", backgroundColor: "rgba(13,14,45,0.9" }}
    >
      <div id="topLeftBox" className="flex w-1/2 justify-start items-center">
        <span
          id="topLocationTitle"
          className="flex text-white font-semibold text-2xl"
        >
          {pageTitle({
            title: "경기 기록관",
            desp: "새로운 경기를 준비하고 지난 경기 결과를 검색할 수 있습니다.",
          })}
        </span>
      </div>
      <div id="topRightWrapper" className="flex w-1/2 justify-end items-center">
        <div id="topRightBox" className="flex gap-x-4">
          <div
            id="topSearchBox"
            className="flex border border-gray-500 rounded-3xl w-56 h-10 px-1"
          >
            <div
              id="topSearchIconBox"
              className="flex w-1/5 h-full justify-center items-center"
            >
              <FontAwesomeIcon icon={faSearch} className="text-white" />
            </div>
            <div
              id="topSearchTextBox"
              className="flex w-4/5 h-full justify-start items-center"
            >
              <input
                id="topSearchInput"
                type="text"
                className="outline-none border-none focus:ring-0 bg-transparent text-white placeholder:text-white"
                placeholder="검색..."
              />
            </div>
          </div>
          <div
            id="topRightIconBox"
            className="flex w-full justify-around items-center gap-x-3"
          >
            <div
              id="topRightUser"
              className="flex gap-x-2 justify-center items-center"
            >
              <FontAwesomeIcon
                icon={faCircleUser}
                className={"text-white text-xl"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopMenus;
