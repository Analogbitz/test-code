import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import DetailPage from "./pages/DetailPage";
import { SummaryPage } from "./pages/SummaryPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" key="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/detail/:id" element={<DetailPage/>}/>
        <Route path="/summary" element={<SummaryPage/>}/>
      </Routes>
    </>
  );
}

export default App;
