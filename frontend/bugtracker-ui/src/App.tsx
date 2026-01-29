import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./component/ProtectedRoute";
import UserLayout from "./layouts/UserLayout";
import DeveloperLayout from "./layouts/DeveloperLayout";
import Unauthorized from "./pages/Unauthorized";
import MyBugsPage from "./pages/MyBugsPage";
import ReportBugPage from "./pages/ReportBugPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/" element={<Dashboard />} /> */}

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyBugsPage />} />
          <Route path="report" element={<ReportBugPage />} />
        </Route>

        <Route
          path="/developer"
          element={
            <ProtectedRoute allowedRoles={["Developer"]}>
              <DeveloperLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
