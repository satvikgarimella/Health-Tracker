
import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Activity, Moon, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTimeBasedGreeting } from "@/utils/timeGreeting";
import { User } from "@/hooks/useHealthData";

interface MainNavbarProps {
  user: User | null;
  onLogout: () => void;
}

const MainNavbar = ({ user, onLogout }: MainNavbarProps) => {
  const location = useLocation();
  const greeting = getTimeBasedGreeting();

  if (!user) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-health-navy mr-6">
              {greeting}, {user.email.split('@')[0]}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink to="/" icon={<Home className="w-4 h-4" />} label="Overview" active={location.pathname === "/"} />
            <NavLink to="/fitness" icon={<Activity className="w-4 h-4" />} label="Fitness" active={location.pathname === "/fitness"} />
            <NavLink to="/health" icon={<Heart className="w-4 h-4" />} label="Health" active={location.pathname === "/health"} />
            <NavLink to="/sleep" icon={<Moon className="w-4 h-4" />} label="Sleep" active={location.pathname === "/sleep"} />
            <NavLink to="/workouts" icon={<Dumbbell className="w-4 h-4" />} label="Workouts" active={location.pathname === "/workouts"} />
          </div>
          <div>
            <button 
              onClick={onLogout}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavLink = ({ to, icon, label, active }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "text-health-mint bg-gray-100"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default MainNavbar;
