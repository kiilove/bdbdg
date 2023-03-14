import React, { useState } from "react";
import FakeUser from "./adminTools/FakeUser";
import Schedule from "./adminTools/Schedule";
import Loading from "./Loading";

const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMenu, setCurrentMenu] = useState({
    idx: 0,
    title: "데모 참가신청 만들기",
    component: <FakeUser />,
  });

  const menuArray = [
    { idx: 0, title: "데모 참가신청 만들기", component: <FakeUser /> },
    { idx: 1, title: "대회중 컨트롤하기", component: <Schedule /> },
  ];
  return (
    <div className="flex w-full h-full flex-col gap-y-5">
      {isLoading && <Loading />}
      <div className="flex w-full p-5 gap-x-5">
        {/* 왼쪽버트 */}
        <div className="flex flex-col gap-y-2">
          <div className="flex bg-gray-900 w-80 p-2 rounded-lg ">
            <span className="flex w-full h-10 text-white bg-gray-800 rounded-lg justify-center items-center font-bold">
              펑션버튼
            </span>
          </div>
          <div className="flex bg-gray-900 w-80 p-2 rounded-lg flex-col gap-y-2">
            {menuArray.map((menu, idx) => (
              <div className="flex w-full h-full text-white bg-gray-800 rounded-lg justify-center items-center font-bold">
                <button
                  className="flex h-10 justify-center items-center"
                  onClick={() => setCurrentMenu(menuArray[idx])}
                >
                  {menu.title}
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* 왼쪽버튼 끝 */}
        {/* 오른쪽 화면 */}
        <div className="flex justify-start items-start">
          {currentMenu.component}
        </div>
        {/* 오른쪽 화면 끝 */}
      </div>
    </div>
  );
};

export default AdminPage;
