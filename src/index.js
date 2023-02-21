import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "tw-elements";
import App from "./App";
import { NewcupContextProvider } from "./context/NewcupContext";
import { EditcupContextProvider } from "./context/EditcupContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <NewcupContextProvider>
    <EditcupContextProvider>
      <App />
    </EditcupContextProvider>
  </NewcupContextProvider>
);
