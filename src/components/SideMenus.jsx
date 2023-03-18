import Logo from "../assets/images/logo/reverse.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faTrophy,
  faUserSecret,
  faLandmarkDome,
  faPeopleRoof,
  faBuilding,
  faScaleBalanced,
  faPeopleLine,
} from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const menuItems = [
  { id: 1, title: "Dashboard", link: "/dashboard", icon: faGaugeHigh },
  { id: 2, title: "경기 새로시작", link: "/newcup", icon: faTrophy },
  { id: 4, title: "대회관리", link: "/cuplist", icon: faLandmarkDome },
  { id: 5, title: "심판진", link: "/refereelist", icon: faScaleBalanced },
  { id: 6, title: "선수진", link: "/refereemanager", icon: faPeopleLine },
  { id: 7, title: "종목", link: "/gamelist", icon: faBuilding },
  { id: 8, title: "협회", link: "/orglist", icon: faBuilding },
  { id: 9, title: "관리자", link: "/onlyadmin", icon: faUserSecret },
  { id: 10, title: "테스트페이지", link: "/test", icon: faUserSecret },
];

const menus = [
  {
    title: "협회관리",
    link: "/",
    subMenus: [
      { title: "기본데이터", link: "/orglist" },
      { title: "소속심판데이터", link: "/refereelist" },
      { title: "선수데이터", link: "/sub-menu-2" },
    ],
  },
  {
    title: "대회관리",
    link: "/cuplist",
    subMenus: [
      { title: "새 대회개최 준비", link: "/newcup" },
      { title: "대회목록", link: "/cuplist" },
      { title: "참가신청서", link: "/sub-menu-2" },
      { title: "참가선수관리", link: "/sub-menu-2" },
      { title: "계측(출전순서)", link: "/sub-menu-2" },
      { title: "종목관리", link: "/sub-menu-2" },
    ],
  },
  {
    title: "관리자",
    link: "/onlyadmin",
    subMenus: [{ title: "데모용 데이터", link: "/onlyadmin" }],
  },
];
const SideMenus = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSubMenuId, setShowSubMenuId] = useState(null);
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  const handleMenuClick = (props) => {
    setSelected(() => props.title);
    window.location.href = props.link;
  };

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  return (
    <div
      className="flex w-full flex-col rounded-md bg-transparent"
      style={{ height: "900px", backgroundColor: "rgba(13,14,45,0.9" }}
    >
      <div className="flex p-3 w-full h-20 justify-around">
        <Link to="/">
          <span className="text-lg font-bold text-white flex justify-center items-center h-full">
            협회관리시스템
          </span>
        </Link>
      </div>
      <div className="flex bg-gray-600" style={{ height: "1px" }}></div>
      <div className="flex flex-col items-center h-screen text-white">
        <div className="flex w-full justify-start flex-col ">
          {menus.map((menu, index) => (
            <Fragment key={index}>
              <button
                className="px-2 py-1 flex w-full justify-start ml-2 h-12 items-center"
                onClick={() =>
                  setShowSubMenuId(showSubMenuId === index ? null : index)
                }
              >
                {menu.title}
              </button>
              {menu.subMenus && (
                <div className="pl-4 bg-gray-900">
                  {showSubMenuId === index && (
                    <div className="flex w-full flex-col justify-center items-start">
                      {menu.subMenus.map((subMenu, subIndex) => (
                        <button
                          key={subIndex}
                          className="pl-4 py-2 h-12"
                          onClick={() => navigate(subMenu.link)}
                        >
                          {subMenu.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideMenus;
