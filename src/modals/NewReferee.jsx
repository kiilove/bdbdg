import { formTitle } from "../components/Titles";

const inputBoxStyle = "flex w-full rounded-xl border border-gray-500 h-9 mb-1";

const inputTextStyle =
  "w-full border-0 outline-none bg-transparent px-3 text-white text-sm placeholder:text-white focus:ring-0";

export const NewReferee = () => {
  return (
    <div
      className="flex w-full h-full gap-x-16 box-border"
      style={{ minWidth: "800px", maxWidth: "1000px" }}
    >
      <div className="flex w-full h-full p-10">
        <div className="flex w-full h-full">
          <div className="flex w-1/3 h-full flex-col flex-wrap box-border"></div>
          <div className="flex w-2/3 h-full flex-col">
            <div className="flex w-full">
              <div className="flex w-1/3">{formTitle({ title: "이름" })}</div>
              <div className={inputBoxStyle}>
                <input
                  type="text"
                  name="cupName"
                  id="cupName"
                  className={inputTextStyle}
                />
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex w-1/3">{formTitle({ title: "지역" })}</div>
              <div className={inputBoxStyle}>
                <input
                  type="text"
                  name="cupName"
                  id="cupName"
                  className={inputTextStyle}
                />
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex w-1/3">{formTitle({ title: "지역" })}</div>
              <div className={inputBoxStyle}>
                <input
                  type="text"
                  name="cupName"
                  id="cupName"
                  className={inputTextStyle}
                />
              </div>
            </div>
            <div className="flex w-full">
              <div className="flex w-1/3">{formTitle({ title: "지역" })}</div>
              <div className={inputBoxStyle}>
                <input
                  type="text"
                  name="cupName"
                  id="cupName"
                  className={inputTextStyle}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
