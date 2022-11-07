import "./App.css";
import BackgroundImage from "./assets/images//bg/mainBg.jpg";
import SideMenus from "./components/SideMenus";
import TopMenus from "./components/TopMenus";
import CupMain from "./pages/CupMain";

function App() {
  return (
    // <div
    //   className="flex bg-fixed w-full min-h-screen p-3 gap-x-3"
    //   style={{ backgroundImage: "url(" + BackgroundImage + ")" }}
    // >
    <div className="flex w-full min-h-screen p-3 gap-x-3 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-sky-700 via-blue-900 to-gray-900 ">
      <div className="flex w-60 opacity-90">
        <SideMenus />
      </div>
      <div className="flex flex-col w-full h-full">
        <div className="flex w-full h-18">
          <TopMenus />
        </div>
        <div className="flex w-full min-h-screen">
          <CupMain />
        </div>
      </div>
    </div>
  );
}

export default App;
