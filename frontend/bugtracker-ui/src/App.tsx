import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ReportBugPage from "./pages/ReportBugPage";
import UnassignedBug from "./pages/UnassignedBug";
import { getToken } from "./utils/authHelp";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
//import { getToken } from "./utils/authHelp";

function App() {
  const isAuthenticated = !!getToken();
  console.log("isAuth", isAuthenticated);
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="report-bug"
          element={
            isAuthenticated ? <ReportBugPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/unassigned-bug"
          element={
            isAuthenticated ? <UnassignedBug /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
