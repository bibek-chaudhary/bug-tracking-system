import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getUserRole, logout } from "../../utils/authHelp";

type SidebarItem = {
  label: string;
  path: string;
};

const Sidebar: React.FC = () => {
  const role = getUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const items: SidebarItem[] =
    role === "Developer"
      ? [
          { label: "My Bugs", path: "/" },
          { label: "Unassigned Bugs", path: "/unassigned-bug" },
        ]
      : [
          { label: "My Bugs", path: "/" },
          { label: "Report Bug", path: "/report-bug" },
        ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:flex flex-col min-h-screen`}
      >
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Bug Tracker</h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                activeTab === item.path
                  ? "bg-blue-600 text-white font-semibold shadow"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
