import IngCup from "../components/IngCup";
import { pageTitle } from "../components/Titles";

const CupMain = () => {
  return (
    <div className="flex flex-col w-full h-full min-h-screen p-5">
      <div className="flex w-full h-full"></div>
      <div className="flex w-full h-full p-5">
        <IngCup />
      </div>
    </div>
  );
};

export default CupMain;
