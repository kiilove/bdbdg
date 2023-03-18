import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SideMenus from "./components/SideMenus";
import TopMenus from "./components/TopMenus";
import CupMain from "./pages/CupMain";
import IngCup from "./pages/IngCup";
import DragTable from "./components/DragTable";
import NewCupPage from "./pages/NewCupPage";
import CupView from "./pages/CupView";
import CupList from "./pages/CupList";
import RefereeList from "./pages/RefereeList";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import OrgList from "./pages/OrgList";
import { NewcupContextProvider } from "./context/NewcupContext";
import GameList from "./pages/GameList";
import CupNew from "./pages/CupNew";
import ModalTest from "./pages/ModalTest";
import PlayerOrderTable from "./components/PlayerOrderTable";
import AdminPage from "./pages/AdminPage";
import CupInfo from "./components/CupInfo";
import CupInfoView from "./pages/CupInfoView";
import CupViewContainer from "./pages/CupViewContainer";
import Login from "./pages/Login";

function App() {
  return (
    // <div
    //   className="flex bg-fixed w-full min-h-screen p-3 gap-x-3"
    //   style={{ backgroundImage: "url(" + BackgroundImage + ")" }}
    // >
    <BrowserRouter>
      <div className="flex w-full min-h-screen p-2 gap-x-1 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-sky-700 via-blue-900 to-gray-900 box-border">
        <ToastContainer />
        <div className="flex w-48 opacity-90">
          <SideMenus />
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="flex w-full h-18 px-5">
            <TopMenus />
          </div>
          <div className="flex w-full min-h-screen ">
            <Routes>
              <Route path="/" element={<CupMain component={<CupList />} />} />
              <Route
                path="/dashboard"
                element={<CupMain component={<Dashboard />} />}
              />
              <Route
                path="/newcup"
                element={<CupMain component={<NewCupPage />} />}
              />
              <Route path="/cuplist" element={<CupList />} />
              <Route
                path="/cupInfo/:cupId"
                element={<CupMain component={<CupViewContainer />} />}
              ></Route>
              <Route path="/test" element={<ModalTest />} />
              <Route path="/orglist" element={<OrgList />} />

              <Route
                path="/playerorder/:cupId"
                element={<PlayerOrderTable />}
              />
              <Route path="/gamelist" element={<GameList />} />
              <Route path="/refereelist" element={<RefereeList />} />
              <Route path="/onlyadmin" element={<AdminPage />} />
              <Route path="/test2" element={<CupNew />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
