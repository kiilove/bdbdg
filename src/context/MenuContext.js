import React, { createContext, useReducer, useContext } from "react";

const MenuContext = createContext();

const initialState = {
  title: "",
  helptext: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_MENU":
      return {
        title: action.payload.title,
        helptext: action.payload.helptext,
      };
    default:
      return state;
  }
};

const MenuProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);

  return (
    <MenuContext.Provider value={{ state, dispatch }}>
      {children}
    </MenuContext.Provider>
  );
};

const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  const { state, dispatch } = context;
  const updateMenu = (title, helptext) => {
    dispatch({ type: "UPDATE_MENU", payload: { title, helptext } });
  };

  return { state, updateMenu };
};

export { MenuProvider, useMenu };
