import { faEye, faEyeSlash, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";
import { Decrypter, Encrypter } from "../components/Encrypto";
import { formTitle } from "../components/Titles";
import { db } from "../firebase";

import { handleToast } from "../components/HandleToast";
import { async } from "@firebase/util";

const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-1";

const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-gray-500 focus:ring-0";

export const EditReferee = ({ pSetModal, pSetRefresh, pRefId }) => {
  const [basicInfo, setBasicInfo] = useState({});
  const [basicInfoEnc, setBasicInfoEnc] = useState({});
  const [pwdView, setPwdView] = useState(true);

  // const addAuth = async () => {
  //   const auth = getAuth();
  //   let refEmail;
  //   const refPWD = basicInfo.refPassword || basicInfo.refTel;
  //   if (basicInfo.refTel !== undefined && basicInfo.refTel) {
  //     if (basicInfo.refEmail) {
  //       refEmail = basicInfo.refEmail;
  //     } else {
  //       refEmail = basicInfo.refTel + "@bdbdg.kr";
  //     }

  //     await createUserWithEmailAndPassword(auth, refEmail, refPWD)
  //       .then((user) => {
  //         const userInfo = user;
  //         handleToast({ type: "success", msg: "계정 등록 완료" });
  //         return userInfo.user.uid;
  //       })
  //       .then((uid) => {
  //         addReferee(uid);
  //       })
  //       .then(() => {
  //         console.log(refPWD);
  //       });
  //   }
  // };

  const getReferee = async (rId) => {
    let dataObj;
    await getDoc(doc(db, "referee", rId))
      .then((data) => {
        dataObj = { ...data.data() };
        return dataObj;
      })
      .then((data) => {
        setBasicInfo(handleDENC(data));
      });
  };

  const handleENC = (data) => {
    const dummyKeys = Object.keys(data);
    let dataObj;
    dummyKeys.length > 0 &&
      dummyKeys.map((key) => {
        if (key === "refUid") {
          dataObj = { ...dataObj, [key]: data[key] };
        } else {
          const dencValue = Encrypter(data[key]);
          dataObj = { ...dataObj, [key]: dencValue };
        }
      });
    return dataObj;
  };

  const handleDENC = (data) => {
    const dummyKeys = Object.keys(data);
    let dataObj;
    dummyKeys.length > 0 &&
      dummyKeys.map((key) => {
        if (key === "refUid") {
          dataObj = { ...dataObj, [key]: data[key] };
        } else {
          const dencValue = Decrypter(data[key]);
          dataObj = { ...dataObj, [key]: dencValue };
        }
      });
    return dataObj;
  };

  const updateReferee = async (rId) => {
    console.log(handleENC(basicInfo));
    // const refereeRef = doc(db, "referee", rId);
    // try {
    //   setDoc(refereeRef, { ...basicInfoEnc }, { merge: true })
    //     .then(() => setBasicInfoEnc({}))
    //     .then(() => setBasicInfo({}));
    // } catch (error) {
    //   console.log(error.message);
    // } finally {
    //   handleToast({ type: "success", msg: "심판정보 수정 완료" });
    //   pSetRefresh(true);
    //   pSetModal(false);
    // }
  };

  const handleBasciInfo = (e) => {
    if (e.target.name !== "cupPoster") {
      setBasicInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      //console.log(Encrypter(e.target.value ));
    }

    if (e.target.name === "refTel") {
      const delDash = e.target.value.replace("-", "");
      setBasicInfo((prev) => ({ ...prev, refTel: delDash }));
    }

    console.log(basicInfo);
  };

  // useEffect(() => {
  //   handleENC();
  // }, [basicInfo]);

  useMemo(() => getReferee(pRefId), []);

  return (
    <div
      className="flex w-full h-full gap-x-16 box-border"
      style={{ minWidth: "800px", maxWidth: "1000px" }}
    >
      <div className="flex w-full h-full p-10">
        <div className="flex w-full h-full">
          <div className="flex w-1/3 h-full flex-col flex-wrap box-border"></div>
          <div className="flex w-2/3 h-full flex-col gap-y-3">
            <div className="flex w-full">
              <div className="flex w-1/3">{formTitle({ title: "이름" })}</div>
              <div className={inputBoxStyle}>
                <input
                  type="text"
                  name="refName"
                  id="refName"
                  onChange={(e) => handleBasciInfo(e)}
                  value={basicInfo.refName}
                  className={inputTextStyle}
                  placeholder="심판이름 정확히 입력"
                />
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex w-1/3">
                {formTitle({ title: "전화번호" })}
              </div>
              <div className="flex flex-col w-full">
                <div className={inputBoxStyle}>
                  <input
                    type="text"
                    name="refTel"
                    id="refTel"
                    onChange={(e) => handleBasciInfo(e)}
                    value={basicInfo.refTel}
                    className={inputTextStyle}
                    placeholder="숫자만 입력 '-'는 자동삭제됨"
                  />
                </div>
              </div>
            </div>

            <div className="flex w-full">
              <div className="flex w-1/3">{formTitle({ title: "지역" })}</div>
              <div className={inputBoxStyle}>
                <input
                  type="text"
                  name="refLocation"
                  id="refLocation"
                  onChange={(e) => handleBasciInfo(e)}
                  value={basicInfo.refLocation}
                  className={inputTextStyle}
                  placeholder="서울 금천, 인천 연수, 경기 용인"
                />
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex w-1/3">{formTitle({ title: "이메일" })}</div>
              <div className={inputBoxStyle}>
                <span className="text-white">{basicInfo.refEmail}</span>
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex w-1/3">
                {formTitle({ title: "초기비밀번호" })}
              </div>
              <div className={inputBoxStyle}>
                <span className="text-white text-sm flex h-full w-full justify-start items-center ml-2">
                  {pwdView ? basicInfo.refPassword : "****"}
                </span>
                <span className="flex text-white w-10 h-full justify-center items-center">
                  {pwdView ? (
                    <button onClick={() => setPwdView(false)}>
                      <FontAwesomeIcon icon={faEyeSlash} />
                    </button>
                  ) : (
                    <button onClick={() => setPwdView(true)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  )}
                </span>
              </div>
            </div>
            <div className="flex w-full justify-end">
              <button
                className="flex justify-center items-center w-10 h-10 bg-sky-500 rounded-xl hover:cursor-pointer"
                onClick={() => updateReferee()}
              >
                <FontAwesomeIcon icon={faSave} className="text-white text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
