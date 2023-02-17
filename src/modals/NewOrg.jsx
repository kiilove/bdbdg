import { useEffect, useRef } from "react";
import moment from "moment";

import { useState } from "react";
import { formTitle, widgetTitle } from "../components/Titles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSave, faStamp } from "@fortawesome/free-solid-svg-icons";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { handleToast } from "../components/HandleToast";

const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-1";

const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white focus:ring-0";

const NewOrg = () => {
  const [orgInfo, setOrgInfo] = useState({});
  const [orgLoginInfo, setOrgLoginInfo] = useState({});
  const [orgInfoENC, setOrgInfoENC] = useState({});
  const [orgLoginInfoENC, setOrgLoginInfoENC] = useState({});
  const orgNameRef = useRef();
  const orgNickNameRef = useRef();
  const orgLocationRef = useRef();
  const orgTelRef = useRef();
  const orgEmailRef = useRef();
  const orgAdminIDRef = useRef();
  const orgAdminPasswordRef = useRef();

  const updateOrgInfo = () => {
    const info = {
      orgName: orgNameRef.current.value,
      orgNickName: orgNickNameRef.current.value,
      orgLocation: orgLocationRef.current.value,
      orgTel: orgTelRef.current.value,
      orgEmail: orgEmailRef.current.value,
      orgAdminID: orgAdminIDRef.current.value,
    };
    const loginInfo = {
      orgAdminID: orgAdminIDRef.current.value,
      orgAdminPassword: orgAdminPasswordRef.current.value,
    };

    //setOrgInfo(() => ({ ...info }));
    //setOrgLoginInfo(() => ({ ...loginInfo }));
    return { info, loginInfo };
  };

  const handleSaveOrg = async () => {
    const createAt = moment().format("YYYY-MM-DD HH:mm:ss");
    const orgInfo = updateOrgInfo();

    const orgRef = await addDoc(collection(db, "orgs"), {
      ...orgInfo.info,
      createAt,
    })
      .then((doc) => console.log(doc.id))
      .then(() => handleToast({ type: "success", msg: "협회등록완료" }))
      .catch((err) => handleToast({ type: "error", msg: "협회등록오류" }));
    const orgLoginRef = await addDoc(collection(db, "orgsLogin"), {
      ...orgInfo.loginInfo,
      createAt,
    })
      .then((doc) => console.log(doc.id))
      .then(() => handleToast({ type: "success", msg: "관리자등록완료" }))
      .catch((err) => handleToast({ type: "error", msg: "관리자등록오류" }));
  };

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border"
      style={{ minWidth: "800px", maxWidth: "1000px" }}
    >
      <div className="flex w-1/3 flex-col">
        <div className="flex justify-center items-start mt-3">
          <button className="flex justify-center items-center w-full h-10 bg-sky-500 rounded-xl hover:cursor-pointer">
            <FontAwesomeIcon icon={faImage} className="text-white text-lg" />
            <span className="text-white font-light ml-3">협회로고</span>
          </button>
        </div>
        <div className="flex justify-center items-start mt-3">
          <button className="flex justify-center items-center w-full h-10 bg-sky-500 rounded-xl hover:cursor-pointer">
            <FontAwesomeIcon icon={faStamp} className="text-white text-lg" />
            <span className="text-white font-light ml-3">협회직인(인감)</span>
          </button>
        </div>
      </div>
      <div className="flex w-2/3 h-full flex-col flex-wrap box-border">
        <div className="flex w-full">{formTitle({ title: "협회명" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="orgName"
            id="orgName"
            ref={orgNameRef}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full">{formTitle({ title: "단축이름" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="orgNickName"
            id="orgNicKName"
            ref={orgNickNameRef}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full">{formTitle({ title: "지역" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="orgLcation"
            id="orgLocation"
            ref={orgLocationRef}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full">{formTitle({ title: "연락처" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="orgTel"
            id="orgTel"
            ref={orgTelRef}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full">{formTitle({ title: "이메일" })}</div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="orgEmail"
            id="orgEmail"
            ref={orgEmailRef}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full">
          {formTitle({ title: "관리자아이디" })}
        </div>
        <div className={inputBoxStyle}>
          <input
            type="text"
            name="orgAdminID"
            id="orgAdminID"
            ref={orgAdminIDRef}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full">
          {formTitle({ title: "관리자비밀번호" })}
        </div>
        <div className={inputBoxStyle}>
          <input
            type="password"
            name="orgAdminPassword"
            id="orgAdminPassword"
            ref={orgAdminPasswordRef}
            className={inputTextStyle}
          />
        </div>
        <div className="flex w-full justify-end mt-5">
          <button
            className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl hover:cursor-pointer"
            onClick={() => handleSaveOrg()}
          >
            <FontAwesomeIcon icon={faSave} className="text-white text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrg;
