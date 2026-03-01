import { Outlet, NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Settings,
  Shield,
  Bell,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUserProfile, logout } from "../services/authService";
import { useSessionTimer, formatTime } from "../hooks/useSessionTimer";

const menuItems = [
  {
    path: "/bank/portfolio",
    icon: LayoutDashboard,
    label: "Portfolio Dashboard",
  },
  { path: "/bank/borrower-risk", icon: AlertTriangle, label: "Borrower Risk" },
  { path: "/bank/restructuring", icon: FileText, label: "Restructuring Cases" },
  {
    path: "/bank/policy-simulation",
    icon: Settings,
    label: "Policy Simulation",
  },
  { path: "/bank/audit-logs", icon: Shield, label: "Audit Logs" },
];

export function BankLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const timeLeft = useSessionTimer();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getCurrentUserProfile();
        setUser(data);
      } catch (err) {
        console.error("User load error:", err);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl text-primary">PayFluxa</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Risk Governance Console
          </p>
          <a
            href="/"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary mt-3"
          >
            <ArrowLeft size={12} />
            Switch Interface
          </a>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mb-1 transition-colors ${
                  isActive
                    ? "bg-[#EFF6FF] text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                }`
              }
            >
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
              {user?.email?.[0]?.toUpperCase() || "RM"}
            </div>

            <div className="flex-1">
              <div className="text-sm font-medium">
                {user?.role || "Risk Manager"}
              </div>
              <div className="text-xs text-muted-foreground">
                {user?.email || "bank@payfluxa.com"}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white border-b border-border px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Risk Governance Console</span>
            <ChevronRight size={16} />
            <span className="text-foreground">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Session Timer */}
            <div className="text-xs text-muted-foreground mt-2">
              Session expires in: {formatTime(timeLeft)}
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-secondary rounded">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC2626] rounded-full"></span>
            </button>

            {/* Logout */}
            <button onClick={handleLogout} className="text-sm text-red-500">
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
