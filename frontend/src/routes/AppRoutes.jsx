import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Nutrition from "../pages/Nutrition";
import Workouts from "../pages/Workouts";
import AIChat from "../pages/AIChat";
import Profile from "../pages/Profile";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/ai" element={<AIChat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}