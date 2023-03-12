import "../css/TimePicker.css";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import { DEFAULT_CUP_POSTER } from "../const/front";
import { EditcupContext } from "../context/EditcupContext";
import useFirebaseStorage from "../customhooks/useFirebaseStorage";
import { RxCalendar } from "react-icons/rx";
import { BiTime } from "react-icons/bi";
import "dayjs/locale/ko";
import TimePicker from "./TimePicker";
import DatePicker from "react-datepicker";

const INIT_CUPINFO = {
  cupName: "",
  cupPoster: [],
  cupDate: { startDate: dayjs(), startTime: "11:00" },
  cupFee: { basicFee: 0, extraFee: 0, extraType: "없음" },
};

const CupInfo = ({ orgs, cupInfo, updateOn }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [suggestionList, setSuggestionList] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState("");
  const [titlePoster, setTitlePoster] = useState(DEFAULT_CUP_POSTER);
  const [files, setFiles] = useState([]);
  const [posterTheme, setPosterTheme] = useState([]);
  const [storagePath, setStoragePath] = useState("");

  const [getCupInfo, setGetCupInfo] = useState({ ...cupInfo });
  const [editGetCupInfo, setEditGetCupInfo] = useState({ ...INIT_CUPINFO });
  const [suggestionData, setSuggestionData] = useState([]);

  const [showPicker, setShowPicker] = useState(false);
  const [showDatePicker, setDateShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState("11:00");
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));

  const datePickerRef = useRef(null);

  const { progress, urls, errors, representativeImage } = useFirebaseStorage(
    files,
    "images/poster"
  );

  dayjs.locale("ko");
  console.log(cupInfo);
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setShowPicker(false);
  };

  const numberWithCommas = (x) => {
    if (x === undefined || x === "" || x === 0) {
      return;
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  };

  const handleAutoCompleteClick = (value, target) => {
    setEditGetCupInfo((prev) => ({ ...prev, [target]: value }));
    setSuggestionData([]);
  };

  const getSuggestionList = (e, type) => {
    setEditGetCupInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    if (!orgs.length) {
      return;
    }

    switch (type) {
      case "org":
        if (e.target.value) {
          const filteredList = orgs.filter((org) =>
            org.orgName.includes(e.target.value)
          );

          console.log(filteredList);
          setSuggestionData([...filteredList, { orgName: "해당없음" }]);
        }

      default:
        break;
    }
  };

  const parseDate = (dateStr) => {
    if (dateStr === undefined || dateStr === "") {
      return;
    }
    const today = dayjs();
    let date = dayjs(dateStr, ["M-D", "YYYY-M-D"], true);

    if (!date.isValid()) {
      return "";
    }

    // 입력받은 문자열이 '12-31' 형태인 경우에는 올해 연도를 자동으로 붙인다
    if (dateStr.length <= 6) {
      date = date.year(today.year());
    }

    return date.format("YYYY-MM-DD");
  };

  const handleSaveClick = async () => {
    try {
      await updateOn(
        {
          ...editGetCupInfo,
        },
        "cupInfo"
      );
    } catch (error) {
      console.log(error);
    }
  };

  useMemo(() => {
    if (urls.length > 0) {
      setFiles([]);
      console.log(urls);
      setTitlePoster(urls[0].compressedUrl);

      setEditGetCupInfo((prev) => ({ ...prev, cupPoster: urls }));
      setPosterTheme([...urls[0].theme]);
    }
  }, [urls]);

  useMemo(() => {
    if (Object.keys(getCupInfo).length === 0) {
      return;
    }
    if (getCupInfo.cupPoster.length) {
      const findTitleOfPoster =
        getCupInfo.cupPoster.find((poster) => poster.title === true) ||
        getCupInfo.cupPoster[0];
      setTitlePoster(findTitleOfPoster.compressedUrl);
    }

    if (getCupInfo.cupDate.startTime !== "") {
      setSelectedTime(getCupInfo.cupDate.startTime);
    } else {
      setSelectedTime("11:00");
    }

    if (getCupInfo.cupDate.startDate !== "" || !getCupInfo.cupDate.startDate) {
      setSelectedDate(dayjs(getCupInfo.cupDate.startDate).format("YYYY-MM-DD"));
    } else {
      setSelectedDate(dayjs());
    }
  }, [getCupInfo]);

  useMemo(
    () => console.log("복사해온 state", editGetCupInfo),
    [editGetCupInfo]
  );

  useEffect(() => {
    if (!cupInfo.id) {
      return;
    }
    setGetCupInfo({ ...cupInfo });
    setEditGetCupInfo({ ...cupInfo });
    console.log(cupInfo);
    return () => {
      setGetCupInfo({});
    };
  }, [cupInfo]);

  const readMode = (
    <div className="flex w-full h-full flex-col ">
      <div className="flex w-full justify-start items-start my-2 flex-col lg:flex-row">
        <h3
          name="cupName"
          id="cupName"
          className="text-2xl lg:text-4xl font-bold mb-2 bg-transparent border-0 p-2"
        >
          {editGetCupInfo.cupName}
        </h3>
        <h3 className="text-2xl lg:text-4xl font-bold mb-2 bg-transparent border-0 p-2">
          {editGetCupInfo.cupCount}회
        </h3>
      </div>
      <div className="flex w-full justify-start item-center gap-x-5">
        <p className="text-base font-bold mb-2 bg-transparent border-0 w-52 p-2">
          {editGetCupInfo.cupDate.startDate !== "" &&
            dayjs(editGetCupInfo.cupDate.startDate).format("YYYY-MM-DD dddd")}
        </p>
        <p className="text-base font-bold mb-2 bg-transparent border-0 w-52 p-2">
          개최시각 : 13시
        </p>
      </div>
      <div className="flex w-full justify-start item-center gap-x-5">
        <p className="text-base font-bold mb-2 bg-transparent border-0 w-52 p-2">
          {editGetCupInfo.cupLocation}
        </p>

        <p className="text-base font-bold mb-2 bg-transparent border-0 w-52 p-2">
          상세주소
        </p>
      </div>
      <div className="flex w-full justify-start item-center gap-x-5">
        <p className="text-base font-bold mb-2 bg-transparent border-0 w-52 p-2">
          {editGetCupInfo.cupOrg}
        </p>
        <p className="text-base font-bold mb-2 bg-transparent border-0 w-52 p-2">
          주관
        </p>
      </div>
      <div className="flex w-full justify-start item-center gap-x-5">
        <p className="text-base font-bold mb-2 bg-transparent border-0 w-52 p-2">
          참가비 {Number(editGetCupInfo.cupFee.basicFee).toLocaleString()}원
        </p>
        <p className="text-base font-bold mb-2 bg-transparent border-0 w-52 p-2">
          중복출전비 {Number(editGetCupInfo.cupFee.extraFee).toLocaleString()}원
        </p>
        <p className="text-base font-bold mb-2 bg-transparent border-0 w-52 p-2">
          {editGetCupInfo.cupFee.extraType}
        </p>
      </div>
    </div>
  );
  const editMode = (
    <div className="flex w-full h-full flex-col ">
      <div className="flex w-full justify-start items-start my-2 flex-col lg:flex-row">
        <input
          type="text"
          name="cupName"
          id="cupName"
          autoComplete="off"
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            e.preventDefault();
            setEditGetCupInfo((prev) => ({ ...prev, cupName: e.target.value }));
          }}
          value={editGetCupInfo.cupName}
          className="text-2xl lg:text-4xl font-bold mb-2 bg-transparent border p-2 w-full"
        />
        <input
          type="text"
          name="cupCount"
          id="cupCount"
          autoComplete="off"
          onFocus={(e) => e.target.select()}
          placeholder="회차"
          onChange={(e) => {
            e.preventDefault();
            setEditGetCupInfo((prev) => ({
              ...prev,
              cupCount: e.target.value,
            }));
          }}
          value={editGetCupInfo.cupCount}
          className="text-2xl lg:text-4xl font-bold mb-2 bg-transparent border p-2 w-32"
        />
        <h3 className="text-2xl lg:text-4xl font-bold mb-2 bg-transparent border-0 p-2">
          회
        </h3>
      </div>
      <div className="flex w-full justify-start item-center gap-x-2 ">
        <input
          type="text"
          name="cupDate"
          id="cupDate"
          autoComplete="off"
          onFocus={(e) => e.target.select()}
          placeholder="개최일자"
          onBlur={(e) => {
            e.preventDefault();
            setEditGetCupInfo((prev) => ({
              ...prev,
              cupDate: {
                ...editGetCupInfo.cupDate,
                startDate: dayjs(parseDate(e.target.value)).format(
                  "YYYY-MM-DD"
                ),
              },
            }));
          }}
          onChange={(e) => {
            e.preventDefault();
            setEditGetCupInfo((prev) => ({
              ...prev,
              cupDate: { ...editGetCupInfo.cupDate, startDate: e.target.value },
            }));
          }}
          value={editGetCupInfo.cupDate.startDate}
          className="text-base font-bold mb-2 bg-transparent border p-2 w-48"
        />
        <div className="relative">
          <button
            className="flex w-10 border  justify-center items-center border-gray-500"
            style={{ height: "2.6rem" }}
            // onClick={() => {
            //   setDateShowPicker(!showDatePicker);
            //   datePickerRef.current.fucus();
            // }}
          >
            <RxCalendar className="text-xl" />
          </button>
        </div>
        <input
          type="text"
          name="cupStartTime"
          id="cupStartTime"
          autoComplete="off"
          onFocus={(e) => e.target.select()}
          value={selectedTime}
          placeholder="개막시각"
          onChange={(e) => {
            e.preventDefault();
            setSelectedTime(e.target.value);
            setEditGetCupInfo((prev) => ({
              ...prev,
              cupDate: { ...editGetCupInfo.cupDate, startTime: e.target.value },
            }));
          }}
          className="text-base font-bold mb-2 bg-transparent border p-2 w-32 ml-3"
        />
        <div className="relative">
          <button
            className="flex w-10 border  justify-center items-center border-gray-500"
            style={{ height: "2.6rem" }}
            onClick={() => setShowPicker(!showPicker)}
          >
            <BiTime className="text-xl" />
          </button>
          {showPicker && (
            <TimePicker
              onSelect={handleTimeSelect}
              onCancel={() => setShowPicker(false)}
            />
          )}
        </div>
      </div>
      <div className="flex w-full justify-start item-center gap-x-5">
        <input
          type="text"
          name="cupLocation"
          id="cupLocation"
          onFocus={(e) => e.target.select()}
          autoComplete="off"
          value={editGetCupInfo.cupLocation}
          onChange={(e) => {
            e.preventDefault();
            setEditGetCupInfo((prev) => ({
              ...prev,
              cupLocation: e.target.value,
            }));
          }}
          className="text-base font-bold mb-2 bg-transparent border p-2 w-60"
        />

        <input
          type="text"
          name="cupLocationAddr"
          id="cupLocationAddr"
          autoComplete="off"
          placeholder="주소"
          onFocus={(e) => e.target.select()}
          value={editGetCupInfo.cupLocationAddr}
          onChange={(e) => {
            e.preventDefault();
            setEditGetCupInfo((prev) => ({
              ...prev,
              cupLocationAddr: e.target.value,
            }));
          }}
          className="text-base font-bold mb-2 bg-transparent border p-2 w-1/2"
        />
      </div>
      <div className="flex justify-start item-center gap-x-5 ">
        <div className="flex relative">
          <input
            type="text"
            name="cupOrg"
            id="cupOrg"
            autoComplete="off"
            placeholder="협회"
            onFocus={(e) => e.target.select()}
            value={editGetCupInfo.cupOrg}
            onChange={(e) => {
              getSuggestionList(e, "org");
            }}
            className="text-base font-bold mb-2 bg-transparent border p-2 w-60"
          />

          {suggestionData.length > 0 && (
            <ul className="absolute text-white w-60 top-12 bg-gray-900">
              <div className="flex w-full h-5 justify-end px-2 text-xs">
                <button onClick={() => setSuggestionData([])}>닫기</button>
              </div>
              {suggestionData.map((option) => (
                <li
                  className="hover:bg-gray-300 px-2 cursor-pointer my-3 h-10 flex items-center hover:text-gray-900"
                  key={option.id}
                  onClick={() =>
                    handleAutoCompleteClick(option.orgName, "cupOrg")
                  }
                >
                  {option.orgName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex relative">
          <input
            type="text"
            name="cupAgency"
            id="cupAgency"
            autoComplete="off"
            value={editGetCupInfo.cupAgency}
            placeholder="기관"
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              getSuggestionList(e, "agency");
            }}
            className="text-base font-bold mb-2 bg-transparent border p-2 w-60"
          />

          {suggestionData.length > 0 && (
            <ul className="bg-white absolute text-black w-60 top-12">
              <div className="flex w-full h-5 justify-end px-2 text-xs">
                <button onClick={() => setSuggestionData([])}>닫기</button>
              </div>
              {suggestionData.map((option) => (
                <li
                  className="hover:bg-sky-300 px-2 cursor-pointer"
                  key={option.id}
                  onClick={() =>
                    handleAutoCompleteClick(option.agencyName, "cupAgency")
                  }
                >
                  {option.orgName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex w-full justify-start items-start gap-x-5 ">
        <input
          type="text"
          name="cupBasicFee"
          id="cupBasicFee"
          autoComplete="off"
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            e.preventDefault();
            setEditGetCupInfo((prev) => ({
              ...prev,
              cupFee: {
                ...editGetCupInfo.cupFee,
                basicFee: parseInt(e.target.value.replace(/[^0-9]/g, "")),
              },
            }));
          }}
          value={numberWithCommas(editGetCupInfo.cupFee.basicFee)}
          className="text-base font-bold mb-2 bg-transparent border p-2 w-60"
        />
        <input
          type="text"
          name="cupExtraFee"
          id="cupExtraFee"
          autoComplete="off"
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            e.preventDefault();
            setEditGetCupInfo((prev) => ({
              ...prev,
              cupFee: {
                ...editGetCupInfo.cupFee,
                extraFee: parseInt(e.target.value.replace(/[^0-9]/g, "")),
              },
            }));
          }}
          value={numberWithCommas(editGetCupInfo.cupFee.extraFee)}
          className="text-base font-bold mb-2 bg-transparent border p-2 w-60"
        />
        <button
          className={`${
            editGetCupInfo.cupFee.extraType === "정액"
              ? "bg-gray-200 text-black font-bold border-gray-300 "
              : "border-gray-500 "
          } flex w-20 border  justify-center items-center`}
          style={{ height: "2.6rem" }}
          onClick={() => {
            setEditGetCupInfo((prev) => ({
              ...prev,
              cupFee: { ...editGetCupInfo.cupFee, extraType: "정액" },
            }));
          }}
        >
          정액
        </button>
        <button
          className={`${
            editGetCupInfo.cupFee.extraType === "누적"
              ? "bg-gray-200 text-black font-bold border-gray-300 "
              : "border-gray-500 "
          } flex w-20 border  justify-center items-center`}
          style={{ height: "2.6rem" }}
          onClick={() => {
            setEditGetCupInfo((prev) => ({
              ...prev,
              cupFee: { ...editGetCupInfo.cupFee, extraType: "누적" },
            }));
          }}
        >
          누적
        </button>
        <button
          className={`${
            editGetCupInfo.cupFee.extraType === "없음"
              ? "bg-gray-200 text-black font-bold border-gray-300 "
              : "border-gray-500 "
          } flex w-20 border  justify-center items-center`}
          style={{ height: "2.6rem" }}
          onClick={() => {
            setEditGetCupInfo((prev) => ({
              ...prev,
              cupFee: { ...editGetCupInfo.cupFee, extraType: "없음" },
            }));
          }}
        >
          없음
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="w-full h-full relative rounded-lg p-0"
      style={{ minHeight: "700px" }}
    >
      {editGetCupInfo.cupPoster.length > 0 ? (
        <div
          className="flex justify-center items-center w-full h-full relative"
          style={{
            backgroundImage: `linear-gradient(to right, ${editGetCupInfo.cupPoster[0].colorTheme[0]}, ${editGetCupInfo.cupPoster[0].colorTheme[1]}`,
          }}
        >
          <img
            src={titlePoster}
            alt="Movie poster"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full object-cover object-center md:w-10/12 lg:w-8/12"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-full relative">
          <img
            src={titlePoster}
            alt="Movie poster"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full object-cover object-center md:w-10/12 lg:w-8/12"
          />
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-gray-900 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-gray-900 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-gray-900 to-transparent" />
      <div className="absolute bottom-0 text-white py-6 px-4 flex justify-start items-start flex-col w-full ">
        <div className="flex w-full h-full flex-col md:flex-row">
          {editGetCupInfo.id ? (isEditMode ? editMode : readMode) : ""}
          <div className="flex flex-col w-full md:w-1/3">
            <div className="flex w-full h-full justify-end items-end gap-x-2 ">
              <label htmlFor="cupPoster">
                <input
                  type="file"
                  multiple
                  hidden
                  name="cupPoster"
                  id="cupPoster"
                  onChange={(e) => handleFileChange(e)}
                />
                <div className="w-28 h-8 bg-gray-900 border text-white text-sm cursor-pointer flex justify-center items-center">
                  <span>포스터 업로드</span>
                </div>
              </label>
              {isEditMode ? (
                <button
                  className=" w-28 h-8 bg-gray-900 border text-white text-sm"
                  onClick={() => {
                    handleSaveClick();
                    setIsEditMode(false);
                  }}
                >
                  <span>저장</span>
                </button>
              ) : (
                <button
                  className=" w-28 h-8 bg-gray-900 border text-white text-sm"
                  onClick={() => setIsEditMode(true)}
                >
                  <span>수정</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CupInfo;
