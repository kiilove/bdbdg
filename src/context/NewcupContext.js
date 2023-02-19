import { useMemo, useReducer } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { DEFAULT_CUP_POSTER } from "../const/front";
import { NewcupReducer } from "./NewcupReduce";

const INITIAL_STATE = {
  newCup: { cupInfo: { cupPoster: [] }, refereeAssign: [] },
  step: 1,
};

export const NewcupContext = createContext(INITIAL_STATE);
export const NewcupContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(NewcupReducer, INITIAL_STATE);
  //console.log(state);
  useMemo(() => {
    //console.log("memo", state);
    localStorage.setItem("newCup", JSON.stringify(state.newCup));
    localStorage.setItem("step", JSON.stringify(state.step));
  }, [state.newCup, state.step]);

  return (
    <NewcupContext.Provider
      value={{ newCup: state.newCup, step: state.step, dispatch }}
    >
      {children}
    </NewcupContext.Provider>
  );
};
