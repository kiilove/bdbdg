import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BackgroundImage from "./assets/images//bg/mainBg.jpg";
import SideMenus from "./components/SideMenus";
import TopMenus from "./components/TopMenus";
import CupMain from "./pages/CupMain";
import IngCup from "./pages/IngCup";
import DragTable from "./components/DragTable";
import NewCupPage from "./pages/NewCupPage";

function App() {
  return (
    // <div
    //   className="flex bg-fixed w-full min-h-screen p-3 gap-x-3"
    //   style={{ backgroundImage: "url(" + BackgroundImage + ")" }}
    // >
    <BrowserRouter>
      <div className="flex w-full min-h-screen p-3 gap-x-3 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-sky-700 via-blue-900 to-gray-900 box-border">
        <div className="flex w-60 opacity-90">
          <SideMenus />
        </div>
        <div className="flex flex-col w-full h-full">
          <div className="flex w-full h-18 px-5">
            <TopMenus />
          </div>
          <div className="flex w-full min-h-screen ">
            <Routes>
              <Route path="/" element={<CupMain component={<IngCup />} />} />
              <Route
                path="/newcup"
                element={<CupMain component={<NewCupPage />} />}
              />
              <Route path="/test" element={<DragTable />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
