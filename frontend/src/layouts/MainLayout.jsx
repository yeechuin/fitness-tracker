import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function MainLayout() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col gap-4">
        <h1 className="text-xl font-bold mb-6">Fitness AI</h1>

        <NavLink to="/" className="hover:text-gray-300">
          Dashboard
        </NavLink>

        <NavLink to="/nutrition" className="hover:text-gray-300">
          Nutrition
        </NavLink>

        <NavLink to="/workouts" className="hover:text-gray-300">
          Workouts
        </NavLink>

        <NavLink to="/ai" className="hover:text-gray-300">
          AI Coach
        </NavLink>

        <NavLink to="/profile" className="hover:text-gray-300">
          Profile
        </NavLink>

        <button onClick={handleLogout} className="hover:text-gray-300 mt-auto">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}