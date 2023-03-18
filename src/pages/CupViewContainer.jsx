import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import GameCategoryTable from "../components/GameCategoryTable";
import PlayerOrderTable from "../components/PlayerOrderTable";
import { EditcupContext } from "../context/EditcupContext";
import { useMenu } from "../context/MenuContext";
import useFirestore from "../customhooks/useFirestore";
import EditAssignReferees from "../modals/EditAssignReferees";
import CupInfoView from "./CupInfoView";
import CupInvoice from "./CupInvoice";

const CupViewContainer = () => {
  const { state, updateMenu } = useMenu();
  const [currentTab, setCurrentTab] = useState(0);
  const params = useParams();
  const { editCup } = useContext(EditcupContext);
  const { data: cupEditData, updateData: cupUpdateData } = useFirestore();

  const tabsArray = [
    {
      idx: 0,
      title: "대회정보",
      component: <CupInfoView cupId={params.cupId} />,
      message: {
        title: "대회정보 관리",
        body: "대회의 기본정보를 표시합니다. QR코드는 접수신청 정보가 담겨있습니다. ",
      },
    },
    {
      idx: 1,
      title: "참가신청서",
      component: <CupInvoice cupId={params.cupId} />,
      message: {
        title: "참가신청서 관리",
        body: "현재 대회에 참가신청서 현황을 보여드립니다.",
      },
    },
    {
      idx: 2,
      title: "대회참가심판선정",
      component: <EditAssignReferees cupId={params.cupId} />,
      message: {
        title: "심판선정",
        body: "대회에 참여하는 심판 전체 그룹 선정합니다.",
      },
    },
    {
      idx: 3,
      title: "종목별 신청현황/심판배정",
      component: <GameCategoryTable cupId={params.cupId} />,
      message: {
        title: "종목 및 심판 관리",
        body: "대회의 종목 운영여부와 심판 배정을 관리합니다.",
      },
    },
    {
      idx: 4,
      title: "계측(출전순서)",
      component: <PlayerOrderTable id={params.cupId} />,
      message: {
        title: "계측(출전순서)",
        body: "대회당일 계측시 사용할 수 있습니다. 월체(체급변경) 및 출전순서를 조정할 수 있습니다. ",
      },
    },
  ];

  const handleMenu = (index) => {
    setCurrentTab(index);
    updateMenu(tabsArray[index].message.title, tabsArray[index].message.body);
  };

  useEffect(() => {
    updateMenu(tabsArray[0].message.title, tabsArray[0].message.body);
  }, []);

  return (
    <div className="flex flex-col w-full gap-y-3">
      <div className="w-full h-16 bg-gray-900 p-3 rounded-lg flex-wrap flex box-border flex-col">
        <div className="flex w-full h-full">
          {tabsArray.map((tab, idx) => (
            <button
              className={`flex w-1/5 justify-center items-center h-full rounded-lg text-white text-xl ${
                currentTab === idx ? "bg-blue-600" : ""
              }`}
              onClick={() => handleMenu(idx)}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
      <div className="flex w-full justify-center items-start">
        {tabsArray[currentTab].component}
      </div>
    </div>
  );
};

export default CupViewContainer;
