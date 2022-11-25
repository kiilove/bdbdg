import Logo from "../assets/images/logo/reverse.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGaugeHigh,
  faTrophy,
  faUserSecret,
  faLandmarkDome,
  faPeopleRoof,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const menuItems = [
  { id: 1, title: "Dashboard", link: "/dashboard", icon: faGaugeHigh },
  { id: 2, title: "경기 새로시작", link: "/newcup", icon: faTrophy },
  { id: 4, title: "경기 기록관", link: "/gamelist", icon: faLandmarkDome },
  { id: 6, title: "멤버 모음", link: "/refereemanager", icon: faPeopleRoof },

  { id: 8, title: "관리자", link: "/admin", icon: faUserSecret },
  { id: 10, title: "테스트페이지", link: "/test", icon: faUserSecret },
];
const SideMenus = () => {
  const [selected, setSelected] = useState("");

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
        <div className="flex justify-center items-center">
          <img src={Logo} className="w-14" />
        </div>
        <Link to="/">
          <span className="text-3xl font-bold text-white flex justify-center items-center h-full">
            BDBDg
          </span>
        </Link>
      </div>
      <div className="flex bg-gray-600" style={{ height: "1px" }}></div>
      <div
        id="menuItemWrapper"
        className="flex flex-col justify-start items-start p-5 gap-y-2"
      >
        {menuItems.map((item, idx) => (
          <div
            id="menuItemBox"
            className={`flex w-full h-14 justify-start items-center px-2 rounded-xl hover:cursor-pointer ${
              item.title === selected && " bg-stone-800"
            }`}
            onClick={() =>
              handleMenuClick({ title: item.title, link: item.link })
            }
          >
            <div
              id="menuItemIconBox"
              className={`flex w-8 h-8 justify-center items-center rounded-xl mr-2 ${
                item.title === selected ? " bg-sky-500" : " bg-slate-800"
              }`}
            >
              <FontAwesomeIcon
                icon={item.icon}
                className={` font-semibold text-sm ${
                  item.title === selected ? "text-white " : "text-sky-500"
                }`}
              />
            </div>
            <span id="menuItemTitle" className="text-white font-medium">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideMenus;
