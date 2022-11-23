import React, { useEffect, useState } from "react";
import "./stepper.css";
import { NewCup } from "../components/Modals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const NewCupPage = () => {
  const [cupInfo, setCupInfo] = useState({});
  const [step, setStep] = useState(1);
  // const stepComponent = (currentStep) => {
  //   let tempComponent;
  //   switch (currentStep) {
  //     case 1:
  //       tempComponent = <NewCupPage isPage={true} />;
  //   }
  //   return tempComponent;
  // };
  const nextButton = (
    <button
      id="menuItemIconBox"
      className="flex w-20 h-10 justify-center items-center rounded-xl bg-blue-700 hover:bg-sky-500 hover:cursor-pointer"
    >
      <FontAwesomeIcon
        icon={faArrowRight}
        className="text-xl text-white font-extrabold"
      />
    </button>
  );

  const stepsArray = [
    {
      id: 1,
      title: "대회정보",
      component: <NewCup isPage={true} cupInfo={setCupInfo} />,
    },
    { id: 2, title: "심판배정" },
    { id: 3, title: "선수선발" },
    { id: 4, title: "종목구성" },
  ];
  useEffect(() => {
    if (step < 1) {
      setStep((prev) => (prev = 1));
    } else if (step >= stepsArray.length) {
      setStep((prev) => (prev = stepsArray.length));
    }
    console.log(step);
  }, [step]);

  const handleStep = (action) => {
    switch (action) {
      case "next":
        if (step >= 1 && step < stepsArray.length) {
          setStep((prev) => prev + 1);
        }
        break;
      case "prev":
        if (step > 1) {
          setStep((prev) => prev - 1);
        } else if (step <= 0) {
          setStep((prev) => (prev = 1));
        }
        break;
      default:
        setStep((prev) => (prev = 1));
        break;
    }
  };

  return (
    <div className="flex w-full h-full flex-col gap-y-8">
      <div className="flex w-full gap-x-8 flex-col">
        <div className="flex w-full justify-center items-center p-10 h-20">
          <ol className="stepper">
            {stepsArray.map((item, idx) =>
              idx <= step - 1 ? (
                <li className="stepper-item-active">
                  <div className="">
                    <h3 className="text-white my-3 font-semibold">
                      {item.title}
                    </h3>
                  </div>
                </li>
              ) : (
                <li className="stepper-item before:bg-blue-500">
                  <div className="">
                    <h3 className="text-white my-3">{item.title}</h3>
                  </div>
                </li>
              )
            )}
          </ol>
        </div>
      </div>
      <div className="flex w-full gap-x-8 flex-col justify-center items-center">
        <div
          className="flex w-3/5 rounded-lg p-10 flex-col"
          style={{ backgroundColor: "rgba(7,11,41,0.5)", minWidth: "900px" }}
        >
          <div className="flex w-full">{stepsArray[step - 1].component}</div>
          <div className="flex justify-between mt-5">
            <div className="flex">
              <button
                id="menuItemIconBox"
                className="flex w-20 h-10 justify-center items-center rounded-xl bg-blue-700 hover:bg-sky-500 hover:cursor-pointer"
                onClick={() => handleStep("prev")}
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="text-xl text-white font-extrabold"
                />
              </button>
            </div>
            <div className="flex">
              <button
                id="menuItemIconBox"
                className="flex w-20 h-10 justify-center items-center rounded-xl bg-blue-700 hover:bg-sky-500 hover:cursor-pointer"
                onClick={() => handleStep("next")}
              >
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-xl text-white font-extrabold"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCupPage;
