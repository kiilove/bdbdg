import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formTitle, widgetTitle } from "./Titles";
const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-3";
const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white";
const saveButton = () => (
  <div
    id="menuItemIconBox"
    className="flex w-20 h-10 justify-center items-center rounded-xl bg-slate-800 hover:bg-sky-500 hover:cursor-pointer"
  >
    <FontAwesomeIcon
      icon={faSave}
      className="text-xl text-white font-extrabold"
    />
  </div>
);
export const NewCup = () => {
  return (
    <div
      className="flex w-full h-full bg-transparent flex-col"
      style={{ minWidth: "800px" }}
    >
      <div className="flex w-full">{formTitle({ title: "대회명" })}</div>
      <div className={inputBoxStyle}>
        <input type="text" className={inputTextStyle} />
      </div>
      <div className="flex w-full">{formTitle({ title: "회차" })}</div>
      <div className={inputBoxStyle} style={{ width: "75px" }}>
        <input type="text" className={inputTextStyle} maxLength="3" />
        <span className="text-white flex justify-center items-center mr-2 text-sm">
          회
        </span>
      </div>
      <div className="flex w-full">{formTitle({ title: "주최기관" })}</div>
      <div className={inputBoxStyle}>
        <input type="text" className={inputTextStyle} />
      </div>
      <div className="flex w-full">{formTitle({ title: "장소" })}</div>
      <div className={inputBoxStyle}>
        <input type="text" className={inputTextStyle} />
      </div>
      <div className="flex w-full">{formTitle({ title: "일자" })}</div>
      <div className={inputBoxStyle}>
        <input type="text" className={inputTextStyle} />
      </div>
      <div className="flex w-full">{formTitle({ title: "포스터" })}</div>
      <div className={inputBoxStyle}>
        <input type="text" className={inputTextStyle} />
      </div>
      <div className="flex w-full my-5 justify-end">{saveButton()}</div>
    </div>
  );
};
export const NewPlayer = () => {};
export const NewGame = () => {
  return (
    <div
      className="flex w-full h-full bg-transparent flex-col"
      style={{ minWidth: "800px" }}
    >
      <div className="flex w-full">{formTitle({ title: "종목명" })}</div>
      <div className={inputBoxStyle}>
        <input type="text" className={inputTextStyle} />
      </div>
      <div className="flex w-full">
        {formTitle({ title: "필요한 심판 인원수" })}
      </div>
      <div className={inputBoxStyle} style={{ width: "50px" }}>
        <input type="text" className={inputTextStyle} maxLength="3" />
      </div>
    </div>
  );
};
export const TransferReferee = () => {};
export const TransferPlayer = () => {};
