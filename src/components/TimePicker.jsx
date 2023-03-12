import React, { useState } from "react";
import PropTypes from "prop-types";

const TimePicker = ({ onSelect, onCancel }) => {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  const handleClick = () => {
    onSelect(
      `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`
    );
  };

  const handleHourChange = (event) => {
    setHour(parseInt(event.target.value));
  };

  const handleMinuteChange = (event) => {
    setMinute(parseInt(event.target.value));
  };

  const hours = Array.from(Array(24).keys());
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <div className=" absolute z-10  border-gray-300 shadow-lg text-black bg-gray-900">
      <div className="flex justify-between px-4 py-2 items-center">
        <div>
          <select
            value={hour}
            onChange={handleHourChange}
            className="text-xs bg-transparent text-white"
          >
            {hours.map((h) => (
              <option key={h} value={h} className="text-black">
                {h.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
        <span className="text-white text-2xl h-full flex justify-center items-center">
          :
        </span>
        <div>
          <select
            value={minute}
            onChange={handleMinuteChange}
            className="text-xs bg-transparent text-white"
          >
            {minutes.map((m) => (
              <option key={m} value={m} className="text-black">
                {m.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-between px-5">
        <div>
          <button
            className="w-16 h-8 bg-gray-900 border text-white text-sm"
            onClick={onCancel}
          >
            닫기
          </button>
        </div>
        <div>
          <button
            className="w-16 h-8 bg-gray-900 border text-white text-sm"
            onClick={handleClick}
          >
            선택
          </button>
        </div>
      </div>
    </div>
  );
};

TimePicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default TimePicker;
