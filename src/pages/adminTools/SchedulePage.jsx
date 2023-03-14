import React from "react";
import { useRealtimeSchedule } from "../../customhooks/useRealTimeSchedule";

const SchedulePage = (props) => {
  const {
    entranceOpenGameCategory,
    beforeStartGameCategory,
    afterEndGameCategory,
    isScheduleLoading,
  } = useRealtimeSchedule(props.cupId);
 
  if (isScheduleLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div>
        <h2>입장 가능한 게임 카테고리</h2>
        {entranceOpenGameCategory.map((gameCategory) => (
          <div key={gameCategory.name}>{gameCategory.title}</div>
        ))}
      </div>
      <div>
        <h2>시작 전인 게임 카테고리</h2>
        {beforeStartGameCategory.map((gameCategory) => (
          <div key={gameCategory.name}>{gameCategory.title}</div>
        ))}
      </div>
      <div>
        <h2>종료된 게임 카테고리</h2>
        {afterEndGameCategory.map((gameCategory) => (
          <div key={gameCategory.name}>{gameCategory.title}</div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
