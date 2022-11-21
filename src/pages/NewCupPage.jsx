import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React, { useEffect, useState } from "react";
import { NewCup } from "../components/Modals";

const nextButton = () => (
  <div
    id="menuItemIconBox"
    className="flex w-20 h-10 justify-center items-center rounded-xl bg-blue-700 hover:bg-sky-500 hover:cursor-pointer"
  >
    <FontAwesomeIcon
      icon={faArrowRight}
      className="text-xl text-white font-extrabold"
    />
  </div>
);

const stepsArray = [
  { id: 1, title: "대회정보" },
  { id: 2, title: "심판배정" },
  { id: 3, title: "선수선발" },
  { id: 4, title: "종목구성" },
];

const stepperLine = "h-3";
const NewCupPage = () => {
  const [cupInfo, setCupInfo] = useState({});
  const [step, setStep] = useState(1);
  useEffect(() => {
    console.log(cupInfo);
  }, [cupInfo]);

  return (
    <div className="flex w-full h-full flex-col gap-y-8">
      <div className="flex w-full gap-x-8 flex-col">
        <div className="flex w-full justify-center items-center p-10 h-20">
          <ul className="stepper">
            <li className="stepper-step stepper-active">
              <div className="stepper-head">
                <span className="stepper-head-icon bg-green-200 w-7 h-7">
                  {" "}
                  1{" "}
                </span>
                <span className="stepper-head-text text-white"> step1 </span>
              </div>
            </li>
            <li className="stepper-step stepper-active">
              <div className="stepper-head">
                <span className="stepper-head-icon bg-green-200 w-3"> 1 </span>
                <span className="stepper-head-text text-white"> step1 </span>
              </div>
            </li>
          </ul>
        </div>
        {/* <div className="flex w-full justify-center items-center p-10 h-20 ">
          <div className="w-7 h-7 rounded-full bg-white"></div>
          <div className="flex bg-white w-52 h-1 rounded-full"></div>
          <div className="w-6 h-6 rounded-full bg-white"></div>
          <div className="flex bg-blue-600 w-52 h-1 rounded-full"></div>
          <div className="w-6 h-6 rounded-full bg-blue-600"></div>
          <div className="flex bg-blue-600 w-52 h-1 rounded-full"></div>
          <div className="w-6 h-6 rounded-full bg-blue-600"></div>
        </div>
        <div className="flex w-full justify-center items-start px-28 h-10">
          <span className="flex text-white w-1/6 justify-center font-semibold text-lg">
            대회정보
          </span>
          <span className="flex text-white w-1/6 justify-center font-semibold text-lg">
            심판배정
          </span>
          <span className="flex text-white w-1/6 justify-center">선수선발</span>
          <span className="flex text-white w-1/6 justify-center">종목선정</span>
        </div> */}
      </div>
      <div className="flex w-full gap-x-8 flex-col justify-center items-center">
        <div
          className="flex w-3/5 rounded-lg p-10 flex-col"
          style={{ backgroundColor: "rgba(7,11,41,0.5)", minWidth: "900px" }}
        >
          <div className="flex w-full">
            <NewCup isPage={true} cupInfo={setCupInfo} />
          </div>
          <div className="flex justify-end mt-5">{nextButton()}</div>
        </div>
      </div>
    </div>
  );
};

export default NewCupPage;
