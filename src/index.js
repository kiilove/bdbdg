import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "tw-elements";
import App from "./App";
import { NewcupContextProvider } from "./context/NewcupContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <NewcupContextProvider>
    <App />
  </NewcupContextProvider>
);
