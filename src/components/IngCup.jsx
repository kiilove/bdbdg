import { pageTitle, widgetTitle } from "./Titles";
import PosterBg from "../assets/images//bg/posterBg.jpg";

const IngCup = () => {
  return (
    <div className="flex w-full h-full flex-col">
      <div className="flex w-full">
        <div
          className="flex w-1/3 justify-center px-5"
          style={{ backgroundColor: "rgba(13,14,45,0.5" }}
        >
          <img
            src="https://img0.yna.co.kr/etc/inner/KR/2016/06/13/AKR20160613024900007_01_i_P4.jpg"
            className="w-60 rounded-2xl"
          />
        </div>
        <div className="flex w-2/3 flex-col px-10">
          <div className="flex justify-start items-top ">
            <span className="text-white font-extrabold text-4xl">
              경기용인보디빌딩대회 13회
            </span>
          </div>
          <div className="flex">
            <span className="text-white">경기용인</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap"></div>
    </div>
  );
};

export default IngCup;
