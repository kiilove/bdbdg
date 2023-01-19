import IngCup from "./IngCup";
import { pageTitle } from "../components/Titles";

const CupMain = (props) => {
  return (
    <div className="flex w-full h-full min-h-screen p-5">{props.component}</div>
  );
};

export default CupMain;
