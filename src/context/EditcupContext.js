import { useMemo, useReducer } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { DEFAULT_CUP_POSTER } from "../const/front";
import { EditcupReducer } from "./EditcupReduce";

const INITIAL_STATE = {
  editCup: {
    cupInfo: { cupPoster: [] },
    refereeAssign: [],
    refereePool: [],
    gamesCategory: [],
  },
};

export const EditcupContext = createContext(INITIAL_STATE);
export const EditcupContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(EditcupReducer, INITIAL_STATE);
  //console.log(state);
  useMemo(() => {
    //console.log("memo", state);
    localStorage.setItem("editCup", JSON.stringify(state.editCup));
  }, [state.editCup]);

  return (
    <EditcupContext.Provider value={{ editCup: state.editCup, dispatch }}>
      {children}
    </EditcupContext.Provider>
  );
};
